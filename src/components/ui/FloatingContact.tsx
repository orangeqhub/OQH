import { contact, phoneHref, whatsappGreeting, whatsappHref } from '../../data/site'
import { WhatsAppGlyph } from './WhatsAppGlyph'
import './FloatingContact.css'

/** Fixed WhatsApp + call buttons, shown on every page. */
export function FloatingContact() {
  return (
    <nav className="fcontact" aria-label="Quick contact">
      <a
        className="fcontact__btn fcontact__btn--wa"
        href={whatsappHref(whatsappGreeting)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        data-cursor="hover"
      >
        <WhatsAppGlyph size={28} />
        <span className="fcontact__tip">Chat on WhatsApp</span>
      </a>
      <a className="fcontact__btn fcontact__btn--call" href={phoneHref} aria-label={`Call us on ${contact.phone}`} data-cursor="hover">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
        </svg>
        <span className="fcontact__tip">{contact.phone}</span>
      </a>
    </nav>
  )
}
