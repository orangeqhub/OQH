import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { device } from '../lib/device'

interface Options {
  /** Max rotation in degrees. */
  max?: number
  /** How far (px) the card leans toward the cursor. */
  lean?: number
}

/**
 * 3D tilt with spring settle. Exposes --mx / --my (0..100%) on the element so
 * CSS can position a light hotspot, and --tilt-x / --tilt-y (-1..1) so child
 * layers can counter-move at their own depth.
 */
export function useTilt<T extends HTMLElement>({ max = 8, lean = 10 }: Options = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !device.finePointer || device.reducedMotion) return

    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' })
    const tx = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' })
    const ty = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' })
    gsap.set(el, { transformPerspective: 1000 })

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      const nx = px * 2 - 1
      const ny = py * 2 - 1
      ry(nx * max)
      rx(-ny * max)
      tx(nx * lean)
      ty(ny * lean)
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
      el.style.setProperty('--tilt-x', nx.toFixed(3))
      el.style.setProperty('--tilt-y', ny.toFixed(3))
    }
    const leave = () => {
      gsap.to(el, { rotationX: 0, rotationY: 0, x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.6)' })
      el.style.setProperty('--tilt-x', '0')
      el.style.setProperty('--tilt-y', '0')
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  }, [max, lean])

  return ref
}
