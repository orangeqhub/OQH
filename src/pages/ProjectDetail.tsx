import { useLayoutEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/site'
import { useScenePreset } from '../hooks/useScenePreset'
import { gsap } from '../lib/gsap'
import { device } from '../lib/device'
import { PageHero } from '../components/layout/PageHero'
import { Footer } from '../components/layout/Footer'
import { Reveal } from '../components/animations/Reveal'
import { PremiumButton } from '../components/ui/PremiumButton'
import { Icon } from '../components/ui/Icon'
import NotFound from './NotFound'
import './pages.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  useScenePreset('project', project?.title ?? 'Project')
  const stage = useRef<HTMLDivElement>(null)

  // Browser + phone rise into place; entrance transforms are cleared afterwards
  // so the screenshots render at full sharpness.
  useLayoutEffect(() => {
    const el = stage.current
    if (!el || device.reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.pd__browser', { y: 120, opacity: 0, rotationX: 18, transformPerspective: 1600, duration: 1.6, delay: 0.9, ease: 'expo.out', clearProps: 'all' })
      gsap.from('.pd__phone', { y: 160, opacity: 0, duration: 1.6, delay: 1.2, ease: 'expo.out', clearProps: 'all' })
    }, el)
    return () => ctx.revert()
  }, [slug])

  if (!project) return <NotFound />
  const next = projects[(index + 1) % projects.length]
  const host = new URL(project.url).host.replace(/^www\./, '')

  return (
    <div className="page">
      <PageHero crumb={{ label: 'Portfolio', to: '/portfolio' }} eyebrow={project.category} lines={[project.title]} lead={project.summary}>
        {project.liveLink && (
          <PremiumButton href={project.url} icon="arrow-up-right">
            Visit live site
          </PremiumButton>
        )}
        <PremiumButton to="/contact" variant="ghost">
          Start a similar project
        </PremiumButton>
      </PageHero>

      <div ref={stage} className="container pd__stage">
        <figure className="pd__browser">
          <div className="pd__bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>{host}</span>
          </div>
          <img src={project.images.desktop} alt={`${project.title} website — desktop homepage`} width={1440} height={900} decoding="async" />
        </figure>
        <figure className="pd__phone">
          <img src={project.images.mobile} alt={`${project.title} website on mobile`} width={585} height={1266} decoding="async" />
        </figure>
      </div>

      <section className="section">
        <div className="container pd__body">
          <Reveal variant="rise" stagger={0.08} as="dl" className="pd__facts">
            <div>
              <dt>Client</dt>
              <dd>{project.title}</dd>
            </div>
            <div>
              <dt>Industry</dt>
              <dd>{project.industry}</dd>
            </div>
            <div>
              <dt>What we delivered</dt>
              <dd>{project.deliverables.join(', ')}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>
                {project.liveLink ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="pd__link" data-cursor="hover">
                    {host} <Icon name="arrow-up-right" size={14} />
                  </a>
                ) : (
                  host
                )}
              </dd>
            </div>
          </Reveal>

          <div className="pd__text">
            <Reveal variant="rise">
              <span className="eyebrow eyebrow--accent">
                <span className="eyebrow__dot" aria-hidden="true" />
                Overview
              </span>
              <p className="pd__big">{project.summary}</p>
            </Reveal>
            <Reveal variant="rise">
              <span className="eyebrow eyebrow--accent">
                <span className="eyebrow__dot" aria-hidden="true" />
                What the site includes
              </span>
            </Reveal>
            <Reveal variant="depth" stagger={0.1} as="ol" className="pd__approach">
              {project.highlights.map((a, i) => (
                <li key={a}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {a}
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container pd__next-wrap">
        <Link to={`/portfolio/${next.slug}`} className="pd__next" data-cursor="view">
          <span className="eyebrow">Next project</span>
          <span className="pd__next-title display">
            {next.title}
            <Icon name="arrow-right" size={40} />
          </span>
          <span className="pd__next-cover" aria-hidden="true">
            <img src={next.images.desktop} alt="" loading="lazy" decoding="async" />
          </span>
        </Link>
      </section>

      <Footer />
    </div>
  )
}
