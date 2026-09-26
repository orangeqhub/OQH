import { industries, type Industry } from '../data/site'
import { useScenePreset } from '../hooks/useScenePreset'
import { useTilt } from '../hooks/useTilt'
import { PageHero } from '../components/layout/PageHero'
import { Footer } from '../components/layout/Footer'
import { Reveal } from '../components/animations/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Icon } from '../components/ui/Icon'
import './pages.css'

export default function Industries() {
  useScenePreset('industries', 'Industries')
  return (
    <div className="page">
      <PageHero
        eyebrow="Industries"
        lines={['Digital solutions', <>for every <span className="accent-text">sector.</span></>]}
        lead="The fundamentals of good software, design and marketing are universal — the details aren’t. We adapt our work to the audiences, rules and rhythms of each industry."
      />
      <section className="section section--tight">
        <div className="container">
          <Reveal variant="depth" stagger={0.07} className="inds" start="top 92%">
            {industries.map((ind, i) => (
              <IndustryCard key={ind.title} industry={ind} index={i} />
            ))}
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Don’t see yours?"
            lines={['Every business is', <>a <span className="accent-text">digital business.</span></>]}
            lead="If your industry isn’t listed, tell us about it — the approach carries over."
          />
        </div>
      </section>
      <Footer />
    </div>
  )
}

function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  const ref = useTilt<HTMLElement>({ max: 8, lean: 6 })
  return (
    <article ref={ref} className="ind" style={{ ['--i' as string]: index }}>
      {/* Miniature environment: perspective floor, floating emblem, light pool */}
      <div className="ind__scene" aria-hidden="true">
        <span className="ind__floor" />
        <span className="ind__pool" />
        <span className="ind__emblem">
          <Icon name={industry.icon} size={34} strokeWidth={1.4} />
        </span>
        <span className="ind__ring" />
      </div>
      <div className="ind__body">
        <h2 className="h3">{industry.title}</h2>
        <p className="muted">{industry.text}</p>
        <ul role="list" className="ind__focus">
          {industry.focus.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}
