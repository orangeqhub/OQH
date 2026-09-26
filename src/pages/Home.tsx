import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { company, process, projectFilters, projects, services, values } from '../data/site'
import { useScenePreset } from '../hooks/useScenePreset'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { device } from '../lib/device'
import { sceneStore } from '../lib/sceneStore'
import { HeroScene } from '../components/3d/HeroScene'
import { Reveal, RevealLines } from '../components/animations/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServiceCard } from '../components/ui/ServiceCard'
import { ProjectCard } from '../components/ui/ProjectCard'
import { PremiumButton } from '../components/ui/PremiumButton'
import { Icon } from '../components/ui/Icon'
import { Footer } from '../components/layout/Footer'
import './Home.css'

const rail = [
  { slug: 'custom-software', label: ['Custom Software', 'Development'], icon: 'code' },
  { slug: 'mobile-apps', label: ['Web & Mobile', 'App Development'], icon: 'phone' },
  { slug: 'digital-marketing', label: ['Digital Marketing', '& Growth'], icon: 'megaphone' },
  { slug: 'video-editing', label: ['Video Editing', '& Motion Graphics'], icon: 'film' },
  { slug: 'graphic-design', label: ['Graphic Design', '& Branding'], icon: 'pen' },
  { slug: 'ui-ux', label: ['UI/UX Design', '& Prototyping'], icon: 'layers' },
] as const

// Neutral, verifiable positioning — no invented client counts or percentages.
const strip = [
  { big: 'End-to-end', small: 'Strategy to launch' },
  { big: `${services.length}`, small: 'Service disciplines' },
  { big: 'One team', small: 'Developers, designers & creatives' },
  { big: 'Long-term', small: 'Partnership mindset' },
]

export default function Home() {
  useScenePreset('home', 'Software, Design & Digital Growth')
  const root = useRef<HTMLDivElement>(null)

  // Map section scroll progress onto the 3D camera path (0 hero … 4 contact).
  useLayoutEffect(() => {
    sceneStore.stage = 0
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-stage]').forEach((sec) => {
        const idx = Number(sec.dataset.stage)
        ScrollTrigger.create({
          trigger: sec,
          start: idx === 0 ? 'top top' : 'top 60%',
          end: 'bottom 60%',
          onUpdate: (self) => (sceneStore.stage = idx + self.progress),
          onLeaveBack: () => (sceneStore.stage = Math.max(0, idx - 0.0001)),
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="home">
      <Hero />
      <ServicesSection />
      <PortfolioSection />
      <AboutSection />
      <Footer />
    </div>
  )
}

/* ------------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || device.reducedMotion) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35 })
      tl.from('.hero__eyebrow', { y: 20, opacity: 0, duration: 1.1 })
        .from('.hero__line > span', { yPercent: 118, rotation: 3, duration: 1.5, stagger: 0.11, clearProps: 'transform' }, '<0.1')
        .from('.hero__lead', { y: 30, opacity: 0, duration: 1.3 }, '<0.5')
        .from('.hero__ctas > *', { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, '<0.15')
        .from('.hero__strip > *', { y: 20, opacity: 0, duration: 1, stagger: 0.07 }, '<0.2')
        .from('.hero__rail > *', { y: 50, opacity: 0, rotationX: -30, duration: 1.3, stagger: 0.06 }, '<0.1')
        .from('.hero__scroll', { opacity: 0, duration: 1 }, '<0.4')
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="hero" data-stage="0" aria-labelledby="hero-title">
      <div className="hero__grid container">
        <div className="hero__copy">
          <p className="hero__eyebrow eyebrow">
            Software <span className="hero__sep">•</span> Creativity <span className="hero__sep">•</span> Digital Growth
          </p>
          <h1 id="hero-title" className="hero__title display">
            <span className="hero__line">
              <span>We Build Digital</span>
            </span>
            <span className="hero__line">
              <span>Experiences That</span>
            </span>
            <span className="hero__line">
              <span className="accent-text">Move Businesses Forward</span>
            </span>
          </h1>
          <p className="hero__lead lead">{company.positioning}</p>
          <div className="hero__ctas">
            <PremiumButton to="/contact" size="lg">
              Start a Project
            </PremiumButton>
            <PremiumButton to="/services" variant="ghost" icon="play" size="lg">
              Explore Services
            </PremiumButton>
          </div>
          <dl className="hero__strip">
            {strip.map((s) => (
              <div key={s.small} className="hero__stat">
                <dt>{s.big}</dt>
                <dd>{s.small}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__visual">
          <HeroScene />
        </div>
      </div>

      <nav className="hero__rail container" aria-label="Core services">
        {rail.map((r) => (
          <Link key={r.slug} to={`/services#${r.slug}`} className="rail" data-cursor="explore">
            <span className="rail__icon">
              <Icon name={r.icon} size={22} />
            </span>
            <span className="rail__label">
              {r.label[0]}
              <br />
              {r.label[1]}
            </span>
            <span className="rail__arrow">
              <Icon name="arrow-right" size={15} />
            </span>
          </Link>
        ))}
      </nav>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__mouse">
          <i />
        </span>
        <span>Scroll</span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------ */

function ServicesSection() {
  return (
    <section className="section hsvc" data-stage="1" aria-labelledby="svc-title">
      <div className="container">
        <SectionHeading
          eyebrow="What we do"
          lines={[
            'Every discipline your',
            <>
              digital growth <span className="accent-text">needs.</span>
            </>,
          ]}
          lead="Software, design, marketing and video — planned together and delivered by one team, so every part of your digital presence works as a whole."
          aside={
            <PremiumButton to="/services" variant="text" icon="arrow-right">
              All services
            </PremiumButton>
          }
        />
        <Reveal variant="depth" stagger={0.07} className="hsvc__grid" start="top 80%">
          {services.map((s, i) => (
            <div key={s.slug} className={i < 2 ? 'hsvc__cell hsvc__cell--feature' : 'hsvc__cell'}>
              <ServiceCard service={s} index={i} size={i < 2 ? 'feature' : 'compact'} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------ */

function PortfolioSection() {
  const [filter, setFilter] = useState<string>('all')
  const list = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.filter === filter)), [filter])
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  // Desktop: pin the section and scroll the gallery sideways, with each slide
  // swinging in from depth like a camera tracking past a wall of screens.
  useLayoutEffect(() => {
    const pinEl = pin.current
    const trackEl = track.current
    if (!pinEl || !trackEl) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1001px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 80)
      const move = gsap.to(trackEl, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.3}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      gsap.utils.toArray<HTMLElement>('.hport__slide', trackEl).forEach((slide) => {
        gsap.fromTo(
          slide,
          { rotationY: -14, opacity: 0.35 },
          {
            rotationY: 0,
            opacity: 1,
            ease: 'none',
            // settles well before the slide reaches centre, so screenshots are flat (sharp) while read
            scrollTrigger: { trigger: slide, containerAnimation: move, start: 'left 105%', end: 'left 72%', scrub: true },
          },
        )
      })
    })
    return () => mm.revert()
  }, [list])

  return (
    <section className="hport" data-stage="2" aria-labelledby="work-title">
      <div ref={pin} className="hport__pin">
        <div className="hport__head container">
          <div>
            <span className="eyebrow eyebrow--accent">
              <span className="eyebrow__dot" aria-hidden="true" />
              Our work
            </span>
            <RevealLines
              as="h2"
              className="h2 hport__title"
              lines={[
                <>
                  Featured <span className="accent-text">Projects</span>
                </>,
              ]}
            />
          </div>
          <div className="hport__filters" role="group" aria-label="Filter projects">
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
          <PremiumButton to="/portfolio" variant="text" icon="arrow-right" className="hport__all">
            View all projects
          </PremiumButton>
        </div>

        <div className="hport__viewport">
          <div ref={track} className="hport__track" key={filter}>
            {list.map((p, i) => (
              <div key={p.slug} className="hport__slide">
                <ProjectCard project={p} index={i} />
              </div>
            ))}
            {list.length === 0 && <p className="muted hport__empty">No projects in this category yet.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------ */

function AboutSection() {
  return (
    <section className="section habout" data-stage="3" aria-labelledby="about-title">
      <div className="habout__grid container">
        <Reveal variant="clip" className="habout__window">
          {/* A framed window onto the 3D studio — the camera is parked in the team zone behind it. */}
          <div className="habout__words" aria-hidden="true">
            {['Think', 'Create', 'Develop', 'Grow'].map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="habout__roles" aria-hidden="true">
            {['Developers', 'Designers', 'Marketers', 'Editors'].map((r, i) => (
              <span key={r} className="habout__role" style={{ ['--i' as string]: i }}>
                <i />
                {r}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal variant="depth" className="habout__panel">
          <span className="eyebrow habout__eyebrow">About Orange Quantum Hub</span>
          <h2 id="about-title" className="h2 habout__title">
            A team that turns ideas into real <span className="habout__accent">digital solutions</span>
          </h2>
          <p className="habout__text">
            We are a team of developers, designers, marketers and creatives focused on building digital solutions that create real
            impact for the businesses we work with — from the first idea to continuous growth.
          </p>
          <ul className="habout__values" role="list">
            {values.map((v) => (
              <li key={v.title}>
                <span className="habout__vicon">
                  <Icon name={v.icon} size={20} />
                </span>
                <span>
                  <strong>{v.title}</strong>
                  <small>{v.text}</small>
                </span>
              </li>
            ))}
          </ul>
          <PremiumButton to="/about" icon="arrow-right">
            Know more about us
          </PremiumButton>
        </Reveal>
      </div>

      <div className="container hprocess">
        <SectionHeading eyebrow="How we work" lines={['From first idea', 'to continuous growth.']} />
        <Reveal variant="rise" stagger={0.1} className="hprocess__row">
          {process.map((p) => (
            <div key={p.step} className="hprocess__step">
              <span className="hprocess__num">{p.step}</span>
              <h3 className="h3">{p.title}</h3>
              <p className="muted">{p.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
