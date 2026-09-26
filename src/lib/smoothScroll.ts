import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { device } from './device'

let lenis: Lenis | null = null

/**
 * Lenis drives wheel scrolling on desktop and feeds ScrollTrigger. Touch
 * scrolling stays native (Lenis default), and reduced-motion users get plain
 * browser scrolling.
 */
export function initSmoothScroll() {
  if (lenis || device.reducedMotion) return null
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

export function scrollToEl(target: string | HTMLElement) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 })
  else el.scrollIntoView({ behavior: device.reducedMotion ? 'auto' : 'smooth' })
}

export function setScrollLocked(locked: boolean) {
  if (!lenis) {
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    return
  }
  if (locked) lenis.stop()
  else lenis.start()
}
