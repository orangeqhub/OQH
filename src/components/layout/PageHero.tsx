import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { device } from '../../lib/device'
import { useParallaxLayers } from '../../hooks/useParallaxLayers'
import './PageHero.css'

interface Props {
  eyebrow: string
  lines: ReactNode[]
  lead?: ReactNode
  /** Right-hand 3D composition. Children with data-depth get pointer parallax. */
  visual?: ReactNode
  children?: ReactNode
  crumb?: { label: string; to: string }
}

/**
 * Inner-page opener: cinematic title that rises line-by-line out of a mask,
 * with an optional floating 3D composition that recedes on scroll.
 */
export function PageHero({ eyebrow, lines, lead, visual, children, crumb }: Props) {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  useParallaxLayers(stage, { range: 28, tilt: 6 })

  useLayoutEffect(() => {
    const el = root.current
    if (!el || device.reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.55 })
      tl.from('.phero__eyebrow', { y: 20, opacity: 0, duration: 1 })
        .from('.phero__line > span', { yPercent: 115, rotation: 3, duration: 1.4, stagger: 0.1, clearProps: 'transform' }, '<0.05')
        .from('.phero__lead, .phero__extra', { y: 30, opacity: 0, duration: 1.2, stagger: 0.1, clearProps: 'transform,opacity' }, '<0.35')
        .from('.phero__visual', { opacity: 0, scale: 0.9, z: -300, rotationY: -12, duration: 1.8 }, '<-0.4')

      // Composition drifts back into the room as the page scrolls
      // (Animated on the wrapper so it never fights the entrance tween.)
      gsap.to('.phero__visual-wrap', {
        scale: 0.86,
        y: -60,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className={`phero ${visual ? 'phero--split' : ''}`}>
      <div className="phero__grid container">
        <div className="phero__copy">
          <div className="phero__eyebrow">
            {crumb && (
              <Link to={crumb.to} className="phero__crumb" data-cursor="hover">
                {crumb.label}
              </Link>
            )}
            <span className="eyebrow eyebrow--accent">
              <span className="eyebrow__dot" aria-hidden="true" />
              {eyebrow}
            </span>
          </div>
          <h1 className="phero__title display">
            {lines.map((l, i) => (
              <span key={i} className="phero__line">
                <span>{l}</span>
              </span>
            ))}
          </h1>
          {lead && <p className="lead phero__lead">{lead}</p>}
          {children && <div className="phero__extra">{children}</div>}
        </div>
        {visual && (
          <div className="phero__visual-wrap" aria-hidden="true">
            <div className="phero__visual">
              <div ref={stage} className="phero__stage">
                {visual}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
