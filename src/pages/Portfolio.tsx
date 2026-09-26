import { useMemo, useState } from 'react'
import { projectFilters, projects } from '../data/site'
import { useScenePreset } from '../hooks/useScenePreset'
import { PageHero } from '../components/layout/PageHero'
import { Footer } from '../components/layout/Footer'
import { Reveal } from '../components/animations/Reveal'
import { ProjectCard } from '../components/ui/ProjectCard'
import { FloatingPanel } from '../components/3d/FloatingPanel'
import './pages.css'

export default function Portfolio() {
  useScenePreset('portfolio', 'Portfolio')
  const [filter, setFilter] = useState<string>('all')
  const list = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.filter === filter)), [filter])

  return (
    <div className="page">
      <PageHero
        eyebrow="Portfolio"
        lines={['Work that looks good', <>and <span className="accent-text">works harder.</span></>]}
        lead="Websites and web platforms we have designed and built for businesses in real estate, travel, education, retail and more."
        visual={
          <>
            <FloatingPanel image={projects[0].images.desktop} title={projects[0].title} icon="building" depth={0.3} className="vis vis--a" />
            <FloatingPanel image={projects[4].images.desktop} title={projects[4].title} icon="cart" depth={0.6} className="vis vis--b" />
            <FloatingPanel image={projects[5].images.desktop} title={projects[5].title} icon="plane" depth={0.95} className="vis vis--c" />
          </>
        }
      />

      <section className="section section--tight">
        <div className="container">
          <div className="gallery__bar">
            <div className="gallery__filters" role="group" aria-label="Filter projects">
              {projectFilters.map((f) => (
                <button
                  key={f.key}
                  className={`chip ${filter === f.key ? 'is-on' : ''}`}
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  data-cursor="hover"
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="gallery__count muted" aria-live="polite">
              {list.length} {list.length === 1 ? 'project' : 'projects'}
            </span>
          </div>

          <Reveal key={filter} variant="depth" stagger={0.08} className="gallery" start="top 95%">
            {list.map((p, i) => {
              const wide = list.length > 2 && (i === 0 || (i === list.length - 1 && list.length % 2 === 0))
              return (
                <div key={p.slug} className={wide ? 'gallery__item gallery__item--wide' : 'gallery__item'}>
                  <ProjectCard project={p} index={i} size={wide ? 'lg' : 'md'} />
                </div>
              )
            })}
          </Reveal>
          {list.length === 0 && <p className="muted">No projects in this category yet.</p>}

        </div>
      </section>

      <Footer />
    </div>
  )
}
