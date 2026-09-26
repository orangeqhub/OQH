import type { CSSProperties } from 'react'
import type { IconName, PanelKind } from '../../data/site'
import { Icon } from '../ui/Icon'
import { PanelVisual } from './panels/PanelVisual'
import './FloatingPanel.css'

interface Props {
  kind?: PanelKind
  /** Show a screenshot/photo instead of an interface mock. */
  image?: string
  title?: string
  icon?: IconName
  /** Parallax depth: 0 = far (moves least) … 1 = near (moves most). */
  depth?: number
  className?: string
  style?: CSSProperties
  /** Hide on small screens to keep the mobile hero light. */
  desktopOnly?: boolean
}

/**
 * A physical-feeling glass display: bevelled edge, inner reflection, soft
 * shadow and an accent rim light. Positioning/rotation comes from the parent.
 */
export function FloatingPanel({ kind = 'web', image, title, icon, depth = 0.5, className = '', style, desktopOnly }: Props) {
  return (
    <div
      className={`fpanel ${desktopOnly ? 'fpanel--desk' : ''} ${className}`}
      style={style}
      data-depth={depth}
    >
      <div className="fpanel__body">
        {title && (
          <div className="fpanel__head">
            {icon && (
              <span className="fpanel__icon">
                <Icon name={icon} size={14} />
              </span>
            )}
            <span className="fpanel__title">{title}</span>
          </div>
        )}
        <div className="fpanel__screen">
          {image ? <img className="fpanel__img" src={image} alt="" loading="lazy" decoding="async" /> : <PanelVisual kind={kind} />}
        </div>
        <span className="fpanel__reflect" aria-hidden="true" />
      </div>
    </div>
  )
}
