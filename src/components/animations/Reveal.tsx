import { useLayoutEffect, useRef, type ElementType, type ReactNode, type CSSProperties, type RefObject } from 'react'
import { gsap } from '../../lib/gsap'
import { device } from '../../lib/device'

/**
 * Scroll-triggered entrance. Each variant has its own personality so sections
 * don't all "fade in" the same way:
 *  - rise:  lifts up and fades in             (body copy, small groups)
 *  - depth: swings forward from Z-space       (cards, panels)
 *  - clip:  wiped open by an expanding mask   (images, scene windows)
 *  - lines: each child line slides out of a mask (headings)
 *  - scale: settles from a slight zoom        (large visuals)
 */
export type RevealVariant = 'rise' | 'depth' | 'clip' | 'lines' | 'scale'

interface Props {
  children: ReactNode
  as?: ElementType
  variant?: RevealVariant
  /** Animate direct children one after another. */
  stagger?: number
  delay?: number
  className?: string
  style?: CSSProperties
  /** ScrollTrigger start position. */
  start?: string
  id?: string
}

const fromVars: Record<RevealVariant, gsap.TweenVars> = {
  rise: { y: 46, opacity: 0 },
  depth: { opacity: 0, y: 80, z: -220, rotationX: 22, transformPerspective: 1200, transformOrigin: '50% 100%' },
  clip: { clipPath: 'inset(18% 12% 18% 12% round 28px)', scale: 1.12, opacity: 0.2 },
  lines: { yPercent: 110, rotation: 2.5 },
  scale: { scale: 0.86, opacity: 0 },
}

const toVars: Record<RevealVariant, gsap.TweenVars> = {
  rise: { y: 0, opacity: 1, duration: 1.2 },
  depth: { opacity: 1, y: 0, z: 0, rotationX: 0, duration: 1.4 },
  clip: { clipPath: 'inset(0% 0% 0% 0% round 28px)', scale: 1, opacity: 1, duration: 1.6, ease: 'expo.inOut' },
  lines: { yPercent: 0, rotation: 0, duration: 1.3 },
  scale: { scale: 1, opacity: 1, duration: 1.5 },
}

export function Reveal({
  children,
  as = 'div',
  variant = 'rise',
  stagger = 0,
  delay = 0,
  className,
  style,
  start = 'top 86%',
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  // Polymorphic tag; the ref/props we pass are valid for any HTML element.
  const Tag = as as 'div'

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || device.reducedMotion) return

    const ctx = gsap.context(() => {
      let targets: gsap.TweenTarget = el
      if (variant === 'lines') {
        // Each child is a line; its wrapper masks the overflow.
        targets = el.querySelectorAll('[data-line] > span')
      } else if (stagger) {
        targets = el.children
      }
      gsap.fromTo(targets, fromVars[variant], {
        ...toVars[variant],
        delay,
        stagger,
        // Once settled, drop every inline transform so text renders on the
        // normal (crisp) path instead of as a composited bitmap.
        clearProps: 'transform,opacity,clipPath',
        scrollTrigger: { trigger: el, start, once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [variant, stagger, delay, start])

  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} className={className} style={style} id={id} data-reveal={variant}>
      {children}
    </Tag>
  )
}

/** Heading whose lines slide out of a mask. Pass lines as an array. */
export function RevealLines({
  lines,
  as = 'h2',
  className,
  delay,
}: {
  lines: ReactNode[]
  as?: ElementType
  className?: string
  delay?: number
}) {
  return (
    <Reveal as={as} variant="lines" stagger={0.09} className={className} delay={delay}>
      {lines.map((line, i) => (
        <span key={i} data-line style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
          <span style={{ display: 'block', transformOrigin: '0 100%' }}>{line}</span>
        </span>
      ))}
    </Reveal>
  )
}
