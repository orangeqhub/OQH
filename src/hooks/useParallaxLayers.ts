import { useEffect, type RefObject } from 'react'
import { sceneStore } from '../lib/sceneStore'
import { device } from '../lib/device'

interface Options {
  /** Max translation in px for depth = 1. */
  range?: number
  /** Max rotation (deg) applied to the whole stage. */
  tilt?: number
  /** Selector for depth layers inside the stage. */
  selector?: string
}

/**
 * Pointer-driven depth parallax for every [data-depth] child of `stageRef`.
 * One rAF loop, eased toward the pointer, writes only transforms. Near layers
 * (depth → 1) travel further than far layers, which reads as real depth.
 */
export function useParallaxLayers(stageRef: RefObject<HTMLElement | null>, { range = 34, tilt = 5, selector = '[data-depth]' }: Options = {}) {
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || device.reducedMotion || !device.finePointer) return

    const layers = Array.from(stage.querySelectorAll<HTMLElement>(selector)).map((el) => ({
      el,
      depth: parseFloat(el.dataset.depth || '0.5'),
    }))
    let x = 0
    let y = 0
    let raf = 0
    let visible = true

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(loop)
    })
    io.observe(stage)

    function loop() {
      raf = 0
      if (!visible) return
      x += (sceneStore.pointer.x - x) * 0.06
      y += (sceneStore.pointer.y - y) * 0.06
      stage!.style.transform = `rotateY(${x * tilt}deg) rotateX(${-y * tilt * 0.6}deg)`
      stage!.style.setProperty('--sheen', x.toFixed(3))
      for (const { el, depth } of layers) {
        const d = depth * range
        el.style.transform = `translate3d(${(-x * d).toFixed(2)}px, ${(-y * d * 0.7).toFixed(2)}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      stage.style.transform = ''
      layers.forEach(({ el }) => (el.style.transform = ''))
    }
  }, [stageRef, range, tilt, selector])
}
