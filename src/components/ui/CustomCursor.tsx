import { useEffect, useRef, useState } from 'react'
import { device } from '../../lib/device'
import './CustomCursor.css'

const labels: Record<string, string> = {
  view: 'View Project',
  explore: 'Explore',
}

/**
 * The robot pointer itself is a native CSS cursor (public/cursor/*.svg, see
 * base.css), so the OS draws it with zero lag regardless of how busy the page
 * is. This component only adds the "View Project" / "Explore" bubble, which is
 * positioned directly on every pointer event — no easing, no animation frame.
 * Touch devices keep their default behaviour.
 */
export function CustomCursor() {
  const bubble = useRef<HTMLDivElement>(null)
  const [enabled] = useState(() => device.finePointer)
  const [mode, setMode] = useState('')

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')

    let current = ''
    const move = (e: PointerEvent) => {
      const el = bubble.current
      if (el) el.style.transform = `translate3d(${e.clientX + 26}px, ${e.clientY + 26}px, 0)`
      const target = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null
      const next = target?.dataset.cursor ?? ''
      if (next !== current) {
        current = next
        setMode(next)
      }
    }
    const leave = () => {
      current = ''
      setMode('')
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null
  const label = labels[mode]

  return (
    <div ref={bubble} className={`cursor-bubble ${label ? 'is-on' : ''}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  )
}
