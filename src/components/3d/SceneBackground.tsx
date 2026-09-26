import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { hasWebGL } from '../../lib/device'
import './SceneBackground.css'

const StudioCanvas = lazy(() => import('./StudioCanvas'))

/**
 * Fixed, full-viewport studio behind all content. The three.js bundle is
 * fetched only after first paint (idle), so text and CTAs are interactive
 * immediately; a painted CSS studio stands in until then — and permanently
 * when WebGL is unavailable.
 */
export function SceneBackground() {
  const [mount, setMount] = useState(false)
  const [ready, setReady] = useState(false)
  // Bumped when the GPU context is lost, which remounts a fresh canvas.
  const [generation, setGeneration] = useState(0)
  const losses = useRef(0)

  const handleContextLost = () => {
    setReady(false)
    losses.current += 1
    // Give the browser a moment to free the old context; after 3 losses stop
    // retrying and leave the painted CSS studio in place.
    if (losses.current > 3) {
      setMount(false)
      return
    }
    setTimeout(() => setGeneration((g) => g + 1), 600)
  }

  useEffect(() => {
    if (!hasWebGL()) return
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    const start = () => setMount(true)
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1200 })
    else setTimeout(start, 400)
  }, [])

  return (
    <div className="scene" aria-hidden="true">
      <div className="scene__fallback" />
      {mount && (
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <div key={generation} className={`scene__canvas ${ready ? 'is-ready' : ''}`} ref={(el) => {
                if (el) requestAnimationFrame(() => setReady(true))
              }}
            >
              <StudioCanvas key={generation} onContextLost={handleContextLost} />
            </div>
          </Suspense>
        </SceneErrorBoundary>
      )}
      <div className="scene__vignette" />
    </div>
  )
}

/** If the GPU context fails, keep the CSS studio instead of a blank page. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.warn('[scene] WebGL scene disabled:', err)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
