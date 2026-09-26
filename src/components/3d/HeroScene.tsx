import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { device } from '../../lib/device'
import { useParallaxLayers } from '../../hooks/useParallaxLayers'
import { FloatingPanel } from './FloatingPanel'
import { FloatingDevice } from './FloatingDevice'
import './HeroScene.css'

/**
 * Foreground layer of the homepage hero: physical glass displays and devices
 * arranged in CSS 3D space in front of the WebGL studio. Each element has a
 * parallax depth; the whole cluster assembles on load and recedes on scroll.
 */
export function HeroScene() {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  useParallaxLayers(stage, { range: 36, tilt: 4 })

  useLayoutEffect(() => {
    const el = root.current
    if (!el || device.reducedMotion) return
    const ctx = gsap.context(() => {
      // Assemble: elements fly in from deep Z at staggered depths.
      gsap.from('.hscene__item', {
        opacity: 0,
        z: -500,
        y: 60,
        rotationX: 18,
        duration: 2,
        ease: 'expo.out',
        stagger: { each: 0.09, from: 'center' },
        delay: 0.5,
      })
      // Recede into the room as the visitor scrolls to Services.
      gsap.to('.hscene__cam', {
        z: -520,
        y: -120,
        rotationX: 14,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: '+=110%', scrub: 0.6 },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="hscene" aria-hidden="true">
      <div className="hscene__cam">
        <div ref={stage} className="hscene__stage">
          <div className="hscene__glow" />

          <div className="hscene__item hscene__laptop">
            <FloatingDevice depth={0.5} type="laptop" screen="code" style={{ position: 'relative', width: '100%' }} />
          </div>

          <div className="hscene__item hscene__phone">
            <FloatingDevice depth={0.85} type="phone" screen="mobile" style={{ position: 'relative', width: '100%' }} />
          </div>

          <div className="hscene__item hscene__p hscene__p--software">
            <FloatingPanel depth={0.3} kind="systems" title="Software Development" icon="code" style={pos} />
          </div>
          <div className="hscene__item hscene__p hscene__p--marketing">
            <FloatingPanel depth={0.4} kind="analytics" title="Digital Marketing" icon="megaphone" style={pos} />
          </div>
          <div className="hscene__item hscene__p hscene__p--design hscene__desk">
            <FloatingPanel depth={0.62} kind="brand" title="Graphic Design" icon="pen" style={pos} />
          </div>
          <div className="hscene__item hscene__p hscene__p--video">
            <FloatingPanel depth={1} kind="timeline" title="Video Editing" icon="film" style={pos} />
          </div>
          <div className="hscene__item hscene__p hscene__p--uiux hscene__desk">
            <FloatingPanel depth={0.72} kind="wireframe" title="UI/UX Design" icon="layers" style={pos} />
          </div>
          <div className="hscene__item hscene__p hscene__p--motion hscene__desk">
            <FloatingPanel depth={0.2} kind="motion" title="Motion" icon="motion" style={pos} />
          </div>
        </div>
      </div>
    </div>
  )
}

const pos = { position: 'relative', width: '100%', height: '100%' } as const
