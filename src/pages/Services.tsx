import { useEffect, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import { process, services } from '../data/site'
import { useScenePreset } from '../hooks/useScenePreset'
import { useTilt } from '../hooks/useTilt'
import { scrollToEl } from '../lib/smoothScroll'
import { PageHero } from '../components/layout/PageHero'
import { Footer } from '../components/layout/Footer'
import { FloatingPanel } from '../components/3d/FloatingPanel'
import { Reveal, RevealLines } from '../components/animations/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { PremiumButton } from '../components/ui/PremiumButton'
import { Icon } from '../components/ui/Icon'
import type { Service } from '../data/site'
import './pages.css'

export default function Services() {
  useScenePreset('services', 'Services')
  const { hash } = useLocation()

  // Deep links from the homepage rail / cards: /services#slug
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => scrollToEl(hash), 900)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <div className="page">
      <PageHero
        eyebrow="Services"
        lines={['Everything digital,', <>under <span className="accent-text">one roof.</span></>]}
        lead="Ten disciplines, one team. Pick a single service or combine them — we plan the work so software, design, content and marketing reinforce each other."
        visual={
          <>
            <FloatingPanel kind="code" title="Engineering" icon="code" depth={0.35} className="vis vis--a" />
            <FloatingPanel kind="analytics" title="Growth" icon="megaphone" depth={0.65} className="vis vis--b" />
            <FloatingPanel kind="wireframe" title="Experience" icon="layers" depth={0.95} className="vis vis--c" />
          </>
        }
      >
        <PremiumButton to="/contact">Start a Project</PremiumButton>
      </PageHero>

      <nav className="svc-index container" aria-label="Services on this page">
        {services.map((s, i) => (
          <a
            key={s.slug}
            href={`#${s.slug}`}
            className="svc-index__link"
            data-cursor="hover"
            onClick={(e) => {
              e.preventDefault()
              scrollToEl(`#${s.slug}`)
              history.replaceState(null, '', `#${s.slug}`)
            }}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {s.title}
          </a>
        ))}
      </nav>

      <div className="container svc-list">
        {services.map((s, i) => (
          <ServiceChapter key={s.slug} service={s} index={i} />
        ))}
      </div>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Engagement" lines={['How a project', 'comes together.']} />
          <Reveal variant="rise" stagger={0.1} className="steps">
            {process.map((p) => (
              <div key={p.step} className="step">
                <span className="step__num">{p.step}</span>
                <div>
                  <h3 className="h3">{p.title}</h3>
                  <p className="muted">{p.text}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function ServiceChapter({ service, index }: { service: Service; index: number }) {
  const tilt = useTilt<HTMLDivElement>({ max: 6, lean: 8 })
  const flip = index % 2 === 1
  return (
    <section id={service.slug} className={`chapter ${flip ? 'chapter--flip' : ''}`} style={{ '--hue': service.hue } as CSSProperties} aria-labelledby={`${service.slug}-t`}>
      <Reveal variant="clip" className="chapter__visual-wrap">
        <div ref={tilt} className="chapter__visual" data-cursor="explore">
          <div className="chapter__screen">
            <img src={service.image} alt={`${service.title} at Orange Quantum Hub`} loading="lazy" decoding="async" width={1400} height={933} />
          </div>
          <span className="chapter__glow" aria-hidden="true" />
        </div>
      </Reveal>
      <div className="chapter__copy">
        <Reveal variant="rise">
          <span className="chapter__num">
            <span className="chapter__icon">
              <Icon name={service.icon} size={20} />
            </span>
            {String(index + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
          </span>
        </Reveal>
        <RevealLines as="h2" className="h2 chapter__title" lines={[service.title]} />
        <Reveal variant="rise" delay={0.1}>
          <p className="lead">{service.description}</p>
        </Reveal>
        <Reveal variant="rise" stagger={0.06} delay={0.15} as="ul" className="chapter__caps">
          {service.capabilities.map((c) => (
            <li key={c}>
              <Icon name="check" size={16} />
              {c}
            </li>
          ))}
        </Reveal>
        <Reveal variant="rise" delay={0.25}>
          <PremiumButton to="/contact" variant="text" icon="arrow-right">
            Discuss {service.title.toLowerCase()}
          </PremiumButton>
        </Reveal>
      </div>
    </section>
  )
}
