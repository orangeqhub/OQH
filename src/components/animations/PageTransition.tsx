import { useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { device } from '../../lib/device'
import { scrollToTop } from '../../lib/smoothScroll'
import { nav } from '../../data/site'
import { Logo } from '../ui/Logo'
import './PageTransition.css'

/**
 * Curtain on route change: a dark panel with the destination name covers the
 * viewport, the new page mounts underneath at scroll 0, then the curtain lifts
 * on a curved edge while the 3D camera glides to the new page's viewpoint.
 */
export function PageTransition() {
  const { pathname } = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  const [label, setLabel] = useState('')

  useLayoutEffect(() => {
    scrollToTop(true)
    requestAnimationFrame(() => ScrollTrigger.refresh())

    if (first.current) {
      first.current = false
      return
    }
    const el = ref.current
    if (!el || device.reducedMotion) return

    const match = nav.find((n) => n.to !== '/' && pathname.startsWith(n.to))
    setLabel(pathname === '/' ? 'Home' : match?.label ?? '')

    const tl = gsap.timeline()
    tl.set(el, { autoAlpha: 1, clipPath: 'ellipse(150% 150% at 50% 100%)' })
      .fromTo(el.querySelector('.ptrans__inner'), { y: 0, opacity: 1 }, { y: -40, opacity: 0, duration: 0.6, ease: 'power2.in', delay: 0.25 })
      .to(el, { clipPath: 'ellipse(150% 0% at 50% 0%)', duration: 1.05, ease: 'expo.inOut' }, '-=0.35')
      .set(el, { autoAlpha: 0 })
    return () => {
      tl.kill()
    }
  }, [pathname])

  return (
    <div ref={ref} className="ptrans" aria-hidden="true">
      <div className="ptrans__inner">
        <Logo variant="full" />
        <span className="ptrans__label">{label}</span>
      </div>
    </div>
  )
}
