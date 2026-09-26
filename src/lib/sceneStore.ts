/**
 * Tiny mutable store shared between the DOM and the WebGL studio.
 * Written from scroll/pointer listeners, read inside the render loop —
 * deliberately not React state, so nothing re-renders at 60fps.
 */

export type ScenePreset =
  | 'home'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'project'
  | 'industries'
  | 'careers'
  | 'contact'

export const sceneStore = {
  /** Normalised pointer, -1..1, smoothed by consumers. */
  pointer: { x: 0, y: 0 },
  /** Continuous stage value on the home page: 0 hero → 4 contact. */
  stage: 0,
  /** 0..1 scroll progress of the current page. */
  progress: 0,
  preset: 'home' as ScenePreset,
  /** Set false when the tab is hidden or the scene is covered. */
  active: true,
}

let listening = false

export function listenPointer() {
  if (listening || typeof window === 'undefined') return
  listening = true
  window.addEventListener(
    'pointermove',
    (e) => {
      sceneStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      sceneStore.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    },
    { passive: true },
  )
  document.addEventListener('visibilitychange', () => {
    sceneStore.active = document.visibilityState === 'visible'
  })
}
