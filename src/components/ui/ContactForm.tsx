import { useId, useState, type FormEvent } from 'react'
import { services, whatsappHref } from '../../data/site'
import { PremiumButton } from './PremiumButton'
import { WhatsAppGlyph } from './WhatsAppGlyph'
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

type Status = { kind: 'idle' } | { kind: 'opened'; url: string }

const empty: Values = { name: '', email: '', company: '', service: '', budget: '', message: '', link: '', website: '' }
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Submitting opens WhatsApp — a chat with the business number with every filled
 * field pre-typed. The visitor still taps "Send" inside WhatsApp (a website
 * can't send on their behalf), and the success state says so honestly.
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
    if (v.email.trim() && !emailRe.test(v.email.trim())) er.email = 'That email address doesn’t look right.'
    if (v.message.trim().length < 10) er.message = 'A few more words, please (at least 10 characters).'
    if (v.link && !/^https?:\/\/\S+$/i.test(v.link.trim())) er.link = 'Links should start with http:// or https://'
    return er
  }

  function buildMessage(v: Values) {
    const t = (x: string) => x.trim()
    // null = field left empty (skipped); '' = intentional blank line
    const lines: (string | null)[] = [
      topic === 'careers' ? '*Job application — via Orange Quantum Hub website*' : '*New project enquiry — via Orange Quantum Hub website*',
      '',
      `Name: ${t(v.name)}`,
      t(v.email) ? `Email: ${t(v.email)}` : null,
      t(v.company) ? `Company: ${t(v.company)}` : null,
      v.service ? `${topic === 'careers' ? 'Discipline' : 'Interested in'}: ${v.service}` : null,
      v.budget ? `Budget: ${v.budget}` : null,
      t(v.link) ? `Portfolio: ${t(v.link)}` : null,
      '',
      topic === 'careers' ? 'About me:' : 'Project details:',
      t(v.message),
    ]
    return lines.filter((l): l is string => l !== null).join('\n')
  }

  // Must stay synchronous: window.open is only allowed inside the click/submit gesture.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (values.website) return // bot
    const er = validate(values)
    setErrors(er)
    const firstBad = Object.keys(er)[0]
    if (firstBad) {
      document.getElementById(`${uid}-${firstBad}`)?.focus()
      return
    }
    const url = whatsappHref(buildMessage(values))
    // Don't pass 'noopener' as a window feature: browsers then always return null,
    // which would look like a blocked popup and open WhatsApp a second time.
    const win = window.open(url, '_blank')
    if (win) win.opener = null
    else window.location.href = url // popup blocked (or in-app browser): open in this tab
    setStatus({ kind: 'opened', url })
  }

  if (status.kind === 'opened') {
    return (
      <div className="cform__done" role="status">
        <span className="cform__done-icon cform__done-icon--wa">
          <WhatsAppGlyph size={30} />
        </span>
        <h3 className="h3">WhatsApp is ready with your message.</h3>
        <p className="muted">
          Your details are filled in — just tap <strong>Send</strong> in WhatsApp and we’ll reply there. If WhatsApp didn’t open, use the
          button below.
        </p>
        <div className="cform__actions">
          <PremiumButton href={status.url} icon="arrow-up-right">
            Open WhatsApp
          </PremiumButton>
          <PremiumButton variant="ghost" icon="arrow-right" onClick={() => setStatus({ kind: 'idle' })}>
            Edit message
          </PremiumButton>
        </div>
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
          <label htmlFor={`${uid}-email`}>Email (optional)</label>
          <input {...field('email')} type="email" autoComplete="email" />
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

      <div className="cform__actions">
        <PremiumButton type="submit" size="lg" icon="none">
          <span className="cform__wa-ico" aria-hidden="true">
            <WhatsAppGlyph size={18} />
          </span>
          {topic === 'careers' ? 'Send application on WhatsApp' : 'Send message on WhatsApp'}
        </PremiumButton>
        <span className="cform__note muted">* Required · opens WhatsApp with your details</span>
      </div>
    </form>
  )
}
