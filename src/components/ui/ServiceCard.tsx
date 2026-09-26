import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import type { Service } from '../../data/site'
import { useTilt } from '../../hooks/useTilt'
import { Icon } from './Icon'
import './ServiceCard.css'

interface Props {
  service: Service
  index: number
  /** 'feature' cards are larger and show the interface mock prominently. */
  size?: 'feature' | 'compact'
}

export function ServiceCard({ service, index, size = 'compact' }: Props) {
  const ref = useTilt<HTMLAnchorElement>({ max: 7, lean: 8 })
  return (
    <Link
      ref={ref}
      to={`/services#${service.slug}`}
      className={`scard scard--${size}`}
      style={{ '--hue': service.hue } as CSSProperties}
      data-cursor="explore"
      aria-label={`${service.title} — ${service.short}`}
    >
      <span className="scard__light" aria-hidden="true" />
      <span className="scard__border" aria-hidden="true" />

      <div className="scard__photo" aria-hidden="true">
        <img src={service.image} alt="" loading="lazy" decoding="async" width={1400} height={933} />
      </div>

      <div className="scard__content">
        <div className="scard__top">
          <span className="scard__icon">
            <Icon name={service.icon} size={22} />
          </span>
          <span className="scard__num">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="scard__text">
          <h3 className="scard__title">{service.title}</h3>
          <p className="scard__short">{service.short}</p>
          <ul className="scard__caps" role="list">
            {service.capabilities.slice(0, 3).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <span className="scard__go" aria-hidden="true">
          <Icon name="arrow-up-right" size={18} />
        </span>
      </div>
    </Link>
  )
}
