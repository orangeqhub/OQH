import type { CSSProperties } from 'react'
import type { PanelKind } from '../../data/site'
import { PanelVisual } from './panels/PanelVisual'
import './FloatingDevice.css'

interface Props {
  type: 'laptop' | 'phone'
  screen: PanelKind
  depth?: number
  className?: string
  style?: CSSProperties
  desktopOnly?: boolean
}

/** CSS-3D hardware: an open laptop (hinged lid + keyboard deck) or a phone. */
export function FloatingDevice({ type, screen, depth = 0.5, className = '', style, desktopOnly }: Props) {
  if (type === 'phone') {
    return (
      <div className={`fdev fdev--phone ${desktopOnly ? 'fpanel--desk' : ''} ${className}`} style={style} data-depth={depth}>
        <div className="fdev__phone">
          <div className="fdev__phone-screen">
            <PanelVisual kind={screen} />
          </div>
          <span className="fdev__island" />
          <span className="fdev__glare" />
        </div>
      </div>
    )
  }
  return (
    <div className={`fdev fdev--laptop ${className}`} style={style} data-depth={depth}>
      <div className="fdev__laptop">
        <div className="fdev__lid">
          <div className="fdev__bezel">
            <div className="fdev__screen">
              <PanelVisual kind={screen} />
            </div>
            <span className="fdev__glare" />
          </div>
        </div>
        <div className="fdev__deck">
          <div className="fdev__keys" />
          <div className="fdev__pad" />
        </div>
        <div className="fdev__shadow" />
      </div>
    </div>
  )
}
