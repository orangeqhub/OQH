/** Device / preference detection, evaluated once and kept in sync with media queries. */

const mq = (q: string) =>
  typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null

const reducedQuery = mq('(prefers-reduced-motion: reduce)')
const finePointerQuery = mq('(hover: hover) and (pointer: fine)')
const smallQuery = mq('(max-width: 760px)')

export const device = {
  get reducedMotion() {
    return !!reducedQuery?.matches
  },
  get finePointer() {
    return !!finePointerQuery?.matches
  },
  get small() {
    return !!smallQuery?.matches
  },
  /** Rough GPU budget: 'low' drops reflections, instances and DPR. */
  get tier(): 'low' | 'mid' | 'high' {
    if (typeof navigator === 'undefined') return 'mid'
    const cores = navigator.hardwareConcurrency || 4
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
    if (this.small || cores <= 4 || mem <= 4) return 'low'
    if (cores >= 8 && mem >= 8) return 'high'
    return 'mid'
  },
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function onMediaChange(cb: () => void): () => void {
  const qs = [reducedQuery, finePointerQuery, smallQuery].filter(Boolean) as MediaQueryList[]
  qs.forEach((q) => q.addEventListener('change', cb))
  return () => qs.forEach((q) => q.removeEventListener('change', cb))
}
