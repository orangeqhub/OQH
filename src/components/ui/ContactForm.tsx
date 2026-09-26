import { useId, useState, type FormEvent } from 'react'
import { contact, services } from '../../data/site'
import { PremiumButton } from './PremiumButton'
import { Icon } from './Icon'
import './ContactForm.css'

type Topic = 'project' | 'careers'

interface Values {
  name: string
  email: string
  company: string
  service: string
  budget: string
  message: string
  link: string
  website: string // honeypot
}

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'mailto' } | { kind: 'error'; message: string }

const empty: Values = { name: '', email: '', company: '', service: '', budget: '', message: '', link: '', website: '' }
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Delivery order: VITE_CONTACT_ENDPOINT (JSON POST) → VITE_CONTACT_EMAIL
 * (opens the visitor's mail client) → an honest "not configured" error.
 * It never pretends a message was sent.
 */
export function ContactForm({ topic = 'project', disciplines }: { topic?: Topic; disciplines?: string[] }) {
  const uid = useId()
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  function validate(v: Values) {
    const er: Partial<Record<keyof Values, string>> = {}
    if (!v.name.trim()) er.name = 'Please tell us your name.'
    if (!v.email.trim()) er.email = 'We need an email address to reply.'
    else if (!emailRe.test(v.email.trim())) er.email = 'That email address doesn’t look right.'
    if (v.message.trim().length < 10) er.message = 'A few more words, please (at least 10 characters).'
    if (v.link && !/^https?:\/\/\S+$/i.test(v.link.trim())) er.link = 'Links should start with http:// or https://'
    return er
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (values.website) return // bot
    const er = validate(values)
    setErrors(er)
    const firstBad = Object.keys(er)[0]
    if (firstBad) {
      document.getElementById(`${uid}-${firstBad}`)?.focus()
      return
    }

    const payload = {
      topic,
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      service: values.service,
      budget: values.budget,
      link: values.link.trim(),
      message: values.message.trim(),
    }

    if (contact.endpoint) {
      setStatus({ kind: 'sending' })
      try {
        const res = await fetch(contact.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setStatus({ kind: 'sent' })
        setValues(empty)
      } catch (err) {
        console.error('[contact] submit failed', err)
        setStatus({ kind: 'error', message: 'Your message couldn’t be sent. Please try again in a moment.' })
      }
      return
    }

    if (contact.email) {
      const subject = topic === 'careers' ? `Careers — ${payload.service || 'Open application'}` : `Project enquiry — ${payload.service || 'General'}`
      const header = [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        payload.company && `Company: ${payload.company}`,
        payload.service && `${topic === 'careers' ? 'Discipline' : 'Service'}: ${payload.service}`,
        payload.budget && `Budget: ${payload.budget}`,
        payload.link && `Link: ${payload.link}`,
      ].filter(Boolean)
      const body = `${header.join('\n')}\n\n${payload.message}`
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setStatus({ kind: 'mailto' })
      return
    }

    console.warn('[contact] No delivery channel configured. Set VITE_CONTACT_ENDPOINT or VITE_CONTACT_EMAIL (see .env.example).')
    setStatus({ kind: 'error', message: 'Online messaging isn’t available yet. Please try again later.' })
  }

  if (status.kind === 'sent' || status.kind === 'mailto') {
    return (
      <div className="cform__done" role="status">
        <span className="cform__done-icon">
          <Icon name="check" size={28} />
        </span>
        <h3 className="h3">{status.kind === 'sent' ? 'Thank you — message received.' : 'Almost there.'}</h3>
        <p className="muted">
          {status.kind === 'sent'
            ? 'We’ll get back to you at the email address you provided.'
            : 'Your email app should have opened with your message ready — just press send.'}
        </p>
        <PremiumButton variant="ghost" icon="arrow-right" onClick={() => setStatus({ kind: 'idle' })}>
          Send another message
        </PremiumButton>
      </div>
    )
  }

  const field = (k: keyof Values) => ({
    id: `${uid}-${k}`,
    name: k,
    value: values[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${uid}-${k}-err` : undefined,
  })
  const err = (k: keyof Values) =>
    errors[k] ? (
      <span id={`${uid}-${k}-err`} className="cform__err">
        {errors[k]}
      </span>
    ) : null

  const options = topic === 'careers' ? disciplines ?? [] : services.map((s) => s.title)

  return (
    <form className="cform" onSubmit={onSubmit} noValidate>
      <div className="cform__row">
        <div className="cform__field">
          <label htmlFor={`${uid}-name`}>Your name *</label>
          <input {...field('name')} autoComplete="name" required />
          {err('name')}
        </div>
        <div className="cform__field">
          <label htmlFor={`${uid}-email`}>Email *</label>
          <input {...field('email')} type="email" autoComplete="email" required />
          {err('email')}
        </div>
      </div>

      <div className="cform__row">
        {topic === 'project' ? (
          <div className="cform__field">
            <label htmlFor={`${uid}-company`}>Company</label>
            <input {...field('company')} autoComplete="organization" />
          </div>
        ) : (
          <div className="cform__field">
            <label htmlFor={`${uid}-link`}>Portfolio / LinkedIn</label>
            <input {...field('link')} type="url" inputMode="url" placeholder="https://" />
            {err('link')}
          </div>
        )}
        <div className="cform__field">
          <label htmlFor={`${uid}-service`}>{topic === 'careers' ? 'Discipline' : 'I’m interested in'}</label>
          <div className="cform__select">
            <select {...field('service')}>
              <option value="">Select…</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
              <option value="Something else">Something else</option>
            </select>
          </div>
        </div>
      </div>

      {topic === 'project' && (
        <fieldset className="cform__field cform__budget">
          <legend>Estimated budget</legend>
          <div className="cform__chips">
            {['Not sure yet', 'Small', 'Medium', 'Large'].map((b) => (
              <label key={b} className={`cform__chip ${values.budget === b ? 'is-on' : ''}`} data-cursor="hover">
                <input type="radio" name="budget" value={b} checked={values.budget === b} onChange={set('budget')} />
                {b}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="cform__field">
        <label htmlFor={`${uid}-message`}>{topic === 'careers' ? 'Tell us about yourself *' : 'Tell us about your project *'}</label>
        <textarea {...field('message')} rows={5} required />
        {err('message')}
      </div>

      {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
      <div className="cform__hp" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input {...field('website')} tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === 'error' && (
        <p className="cform__alert" role="alert">
          {status.message}
        </p>
      )}

      <div className="cform__actions">
        <PremiumButton type="submit" size="lg" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Sending…' : topic === 'careers' ? 'Send application' : 'Send message'}
        </PremiumButton>
        <span className="cform__note muted">* Required fields</span>
      </div>
    </form>
  )
}
