import { Link } from 'react-router-dom'
import type { Project } from '../../data/site'
import { useTilt } from '../../hooks/useTilt'
import { Icon } from './Icon'
import './ProjectCard.css'

export function ProjectCard({ project, index, size = 'md' }: { project: Project; index: number; size?: 'md' | 'lg' }) {
  const ref = useTilt<HTMLAnchorElement>({ max: 5, lean: 6 })
  return (
    <Link
      ref={ref}
      to={`/portfolio/${project.slug}`}
      className={`pcard pcard--${size}`}
      data-cursor="view"
      aria-label={`${project.title} — ${project.category}`}
    >
      <div className="pcard__media">
        <div className="pcard__cover">
          <img src={project.images.desktop} alt="" loading="lazy" decoding="async" width={1440} height={900} />
        </div>
        <span className="pcard__shade" aria-hidden="true" />
        <span className="pcard__glare" aria-hidden="true" />
      </div>

      {/* The same site on a phone, floating over the desktop screenshot */}
      <div className="pcard__phone" aria-hidden="true">
        <img src={project.images.mobile} alt="" decoding="async" width={585} height={1266} />
      </div>

      <div className="pcard__meta">
        <span className="pcard__index">{String(index + 1).padStart(2, '0')}</span>
        <span className="pcard__badge">{project.industry}</span>
      </div>

      <div className="pcard__info">
        <span className="pcard__cat">{project.category}</span>
        <h3 className="pcard__title">{project.title}</h3>
        <p className="pcard__sum">{project.summary}</p>
      </div>

      <span className="pcard__arrow" aria-hidden="true">
        <Icon name="arrow-up-right" size={20} />
      </span>
    </Link>
  )
}
