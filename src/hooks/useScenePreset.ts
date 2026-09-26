import { useEffect } from 'react'
import { sceneStore, type ScenePreset } from '../lib/sceneStore'

/** Points the studio camera at this page's viewpoint and tracks page scroll. */
export function useScenePreset(preset: ScenePreset, title?: string) {
  useEffect(() => {
    sceneStore.preset = preset
    sceneStore.progress = 0
    if (title) document.title = `${title} — Orange Quantum Hub`

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      sceneStore.progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [preset, title])
}
