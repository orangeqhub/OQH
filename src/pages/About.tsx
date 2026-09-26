import { company, process, values } from '../data/site'
import { useScenePreset } from '../hooks/useScenePreset'
import { PageHero } from '../components/layout/PageHero'
import { Footer } from '../components/layout/Footer'
import { FloatingPanel } from '../components/3d/FloatingPanel'
import { Reveal } from '../components/animations/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { GlassCard } from '../components/ui/GlassCard'
import { PanelVisual } from '../components/3d/panels/PanelVisual'
import { PremiumButton } from '../components/ui/PremiumButton'
import { Icon } from '../components/ui/Icon'
import type { PanelKind } from '../data/site'
import './pages.css'

const team: { role: string; text: string; panel: PanelKind }[] = [
  { role: 'Developers', text: 'Engineer software, websites and apps that are fast, secure and maintainable.', panel: 'code' },
  { role: 'Designers', text: 'Shape interfaces, identities and visuals with clarity and intent.', panel: 'wireframe' },
  { role: 'Marketers', text: 'Plan campaigns and read the data that tells us what to do next.', panel: 'analytics' },
  { role: 'Editors & Motion', text: 'Cut, grade and animate stories that hold attention.', panel: 'timeline' },
]

export default function About() {
  useScenePreset('about', 'About')

  return (
    <div className="page">
      <PageHero
        eyebrow="About us"
        lines={['A creative technology', <>studio built for <span className="accent-text">growth.</span></>]}
        lead={company.positioning}
        visual={
          <>
            <FloatingPanel kind="systems" title="Software" icon="code" depth={0.3} className="vis vis--a" />
            <FloatingPanel kind="brand" title="Design" icon="pen" depth={0.6} className="vis vis--b" />
            <FloatingPanel kind="timeline" title="Video" icon="film" depth={0.9} className="vis vis--c" />
          </>
        }
      >
        <PremiumButton to="/contact">Work with us</PremiumButton>
        <PremiumButton to="/portfolio" variant="ghost">
          See our work
        </PremiumButton>
      </PageHero>

      {/* Pillars */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What drives us"
            lines={['Four ideas behind', 'everything we make.']}
            lead="The company is built around a simple chain: good ideas, delivered with solid technology and real creativity, lead to growth."
          />
          <Reveal variant="depth" stagger={0.1} className="pillars">
            {company.pillars.map((p, i) => (
              <div key={p} className="pillar">
                <span className="pillar__num">0{i + 1}</span>
                <span className="pillar__word">{p}</span>
                <span className="pillar__bar" aria-hidden="true" />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Team environment */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="One studio, many crafts" lines={['The people in the room.']} lead="Projects move faster and feel more coherent when the people building, designing and promoting them work side by side." />
          <Reveal variant="depth" stagger={0.08} className="team">
            {team.map((t) => (
              <GlassCard key={t.role} className="team__card">
                <div className="team__screen" aria-hidden="true">
                  <PanelVisual kind={t.panel} />
                </div>
                <h3 className="h3">{t.role}</h3>
                <p className="muted">{t.text}</p>
              </GlassCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Our values" lines={['How we show up', <>for every <span className="accent-text">client.</span></>]} />
          <Reveal variant="rise" stagger={0.07} className="values">
            {values.map((v) => (
              <GlassCard key={v.title} className="value">
                <span className="value__icon">
                  <Icon name={v.icon} size={22} />
                </span>
                <h3 className="h3">{v.title}</h3>
                <p className="muted">{v.text}</p>
              </GlassCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="How we work" lines={['A clear path from', 'idea to impact.']} />
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
