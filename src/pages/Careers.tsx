import { careers } from '../data/site'
import { useScenePreset } from '../hooks/useScenePreset'
import { PageHero } from '../components/layout/PageHero'
import { Footer } from '../components/layout/Footer'
import { FloatingPanel } from '../components/3d/FloatingPanel'
import { Reveal } from '../components/animations/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { GlassCard } from '../components/ui/GlassCard'
import { ContactForm } from '../components/ui/ContactForm'
import { PremiumButton } from '../components/ui/PremiumButton'
import { Icon } from '../components/ui/Icon'
import { scrollToEl } from '../lib/smoothScroll'
import './pages.css'

export default function Careers() {
  useScenePreset('careers', 'Careers')
  return (
    <div className="page">
      <PageHero
        eyebrow="Careers"
        lines={['Build what’s next', <>with <span className="accent-text">us.</span></>]}
        lead={careers.intro}
        visual={
          <>
            <FloatingPanel kind="code" title="Engineering" icon="code" depth={0.3} className="vis vis--a" />
            <FloatingPanel kind="motion" title="Motion" icon="motion" depth={0.6} className="vis vis--b" />
            <FloatingPanel kind="brand" title="Design" icon="pen" depth={0.95} className="vis vis--c" />
          </>
        }
      >
        <PremiumButton onClick={() => scrollToEl('#apply')}>Apply now</PremiumButton>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Who we look for" lines={['Four crafts,', 'one workspace.']} />
          <Reveal variant="depth" stagger={0.08} className="values values--4">
            {careers.disciplines.map((d) => (
              <GlassCard key={d.title} className="value">
                <span className="value__icon">
                  <Icon name={d.icon} size={22} />
                </span>
                <h3 className="h3">{d.title}</h3>
                <p className="muted">{d.text}</p>
              </GlassCard>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container principles">
          <SectionHeading eyebrow="How we work together" lines={['What it’s like', <>on the <span className="accent-text">inside.</span></>]} />
          <Reveal variant="rise" stagger={0.1} as="ol" className="principles__list">
            {careers.principles.map((p, i) => (
              <li key={p.title}>
                <span className="principles__num">0{i + 1}</span>
                <div>
                  <h3 className="h3">{p.title}</h3>
                  <p className="muted">{p.text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="apply" className="section">
        <div className="container apply">
          <div>
            <SectionHeading
              eyebrow="Open application"
              lines={['Introduce', 'yourself.']}
              lead="There are no specific openings listed right now, but we always read open applications. Share your work and tell us what you’d like to do."
            />
          </div>
          <Reveal variant="depth">
            <GlassCard tilt={false} className="form-card">
              <ContactForm topic="careers" disciplines={careers.disciplines.map((d) => d.title)} />
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <Footer showCta={false} />
    </div>
  )
}
