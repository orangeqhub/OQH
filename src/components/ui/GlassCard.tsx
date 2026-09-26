import type { ReactNode, CSSProperties } from 'react'
import { useTilt } from '../../hooks/useTilt'
import './GlassCard.css'

interface Props {
  children: ReactNode
  className?: string
  tilt?: boolean
  style?: CSSProperties
  as?: 'div' | 'li' | 'article'
}

/** Frosted glass surface with cursor light; optional 3D tilt. */
export function GlassCard({ children, className = '', tilt = true, style, as: Tag = 'div' }: Props) {
  const ref = useTilt<HTMLDivElement>({ max: tilt ? 6 : 0, lean: tilt ? 6 : 0 })
  return (
    <Tag ref={ref as never} className={`gcard ${className}`} style={style}>
      <span className="gcard__light" aria-hidden="true" />
      {children}
    </Tag>
  )
}
