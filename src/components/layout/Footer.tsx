import { Link } from 'react-router-dom'
import { company, contact, nav, phoneHref, services, whatsappGreeting, whatsappHref } from '../../data/site'
import { WhatsAppGlyph } from '../ui/WhatsAppGlyph'
import { Logo } from '../ui/Logo'
import { Icon } from '../ui/Icon'
import { PremiumButton } from '../ui/PremiumButton'
import { RevealLines, Reveal } from '../animations/Reveal'
import './Footer.css'

export function Footer({ showCta = true }: { showCta?: boolean }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      {showCta && (
        <section className="footer__cta container" aria-labelledby="footer-cta">
          <div className="footer__cta-glow" aria-hidden="true" />
          <Reveal variant="rise">
            <span className="eyebrow eyebrow--accent">
              <span className="eyebrow__dot" aria-hidden="true" />
              Let&apos;s build what&apos;s next
            </span>
          </Reveal>
          <RevealLines
            as="h2"
            className="footer__cta-title display"
            lines={[
              'Have a project',
              <>
                in <span className="accent-text">mind?</span>
              </>,
            ]}
          />
          <Reveal variant="rise" delay={0.2} className="footer__cta-actions">
            <PremiumButton to="/contact" size="lg">
              Start a Project
            </PremiumButton>
            <PremiumButton to="/services" variant="ghost" size="lg">
              Explore Services
            </PremiumButton>
          </Reveal>
        </section>
      )}

      <div className="footer__main container">
        <div className="footer__brand">
          <Link to="/" aria-label="Orange Quantum Hub — home">
            <Logo variant="full" />
          </Link>
          <p className="footer__pos">{company.tagline}</p>
        </div>

        <nav className="footer__col" aria-label="Company">
          <h3 className="footer__h">Company</h3>
          <ul role="list">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="footer__link" data-cursor="hover">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Services">
          <h3 className="footer__h">Services</h3>
          <ul role="list">
            {services.slice(0, 7).map((s) => (
              <li key={s.slug}>
                <Link to={`/services#${s.slug}`} className="footer__link" data-cursor="hover">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h3 className="footer__h">Contact</h3>
          <ul role="list" className="footer__contact">
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="footer__link">
                  <Icon name="mail" size={16} /> {contact.email}
                </a>
              </li>
            )}
            <li>
              <a href={phoneHref} className="footer__link" data-cursor="hover">
                <Icon name="phone" size={16} /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={whatsappHref(whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="footer__link" data-cursor="hover">
                <WhatsAppGlyph size={16} /> WhatsApp us
              </a>
            </li>
            {contact.address && (
              <li className="footer__link">
                <Icon name="pin" size={16} /> {contact.address}
              </li>
            )}
            <li>
              <Link to="/contact" className="footer__link footer__link--accent" data-cursor="hover">
                Send us a message <Icon name="arrow-up-right" size={15} />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bar container">
        <span>
          © {year} {company.legalName}. All rights reserved.
        </span>
        <span className="footer__pillars">{company.pillars.join(' · ')}</span>
      </div>
    </footer>
  )
}
