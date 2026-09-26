import { useRef } from 'react'
import { contact, process } from '../data/site'
import { useScenePreset } from '../hooks/useScenePreset'
import { useParallaxLayers } from '../hooks/useParallaxLayers'
import { PageHero } from '../components/layout/PageHero'
import { Footer } from '../components/layout/Footer'
import { Reveal } from '../components/animations/Reveal'
import { ContactForm } from '../components/ui/ContactForm'
import { Icon } from '../components/ui/Icon'
import './pages.css'

export default function Contact() {
  useScenePreset('contact', 'Contact')
  const stage = useRef<HTMLDivElement>(null)
  // The form floats as a glass console that leans gently toward the cursor.
  useParallaxLayers(stage, { range: 10, tilt: 2.2 })

  return (
    <div className="page page--bright">
      <PageHero
        eyebrow="Contact"
        lines={['Let’s talk about', <>your <span className="accent-text">next move.</span></>]}
        lead="Tell us what you’re planning — a new product, a redesign, a campaign or a video. We’ll reply with next steps."
      />

      <section className="section section--tight">
        <div className="container contact">
          <div className="contact__side">
            <Reveal variant="rise">
              <h2 className="h3">What happens next</h2>
            </Reveal>
            <Reveal variant="rise" stagger={0.08} as="ol" className="contact__steps">
              {[
                'We read your message and ask any questions we need.',
                'We suggest an approach, timeline and estimate.',
                `Then we ${process[0].title.toLowerCase()}, ${process[1].title.toLowerCase()} and ${process[2].title.toLowerCase()} — together.`,
              ].map((t, i) => (
                <li key={i}>
                  <span>{i + 1}</span>
                  {t}
                </li>
              ))}
            </Reveal>

            {(contact.email || contact.phone || contact.address) && (
              <Reveal variant="rise" as="ul" className="contact__channels">
                {contact.email && (
                  <li>
                    <Icon name="mail" />
                    <a href={`mailto:${contact.email}`} data-cursor="hover">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <Icon name="phone" />
                    <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} data-cursor="hover">
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li>
                    <Icon name="pin" />
                    <span>{contact.address}</span>
                  </li>
                )}
              </Reveal>
            )}
          </div>

          <div className="contact__stage-wrap">
            <div ref={stage} className="contact__stage">
              <Reveal variant="depth" className="contact__console" start="top 95%">
                <div data-depth="0.4" className="contact__console-inner">
                  <div className="contact__console-head" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>new-project.brief</span>
                  </div>
                  <ContactForm topic="project" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer showCta={false} />
    </div>
  )
}
