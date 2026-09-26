import type { ReactNode } from 'react'
import { Reveal, RevealLines } from '../animations/Reveal'
import './SectionHeading.css'

interface Props {
  eyebrow: string
  lines: ReactNode[]
  lead?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  aside?: ReactNode
}

export function SectionHeading({ eyebrow, lines, lead, align = 'left', as = 'h2', aside }: Props) {
  return (
    <header className={`shead shead--${align}`}>
      <div className="shead__main">
        <Reveal variant="rise">
          <span className="eyebrow eyebrow--accent">
            <span className="eyebrow__dot" aria-hidden="true" />
            {eyebrow}
          </span>
        </Reveal>
        <RevealLines as={as} lines={lines} className={as === 'h1' ? 'h1 shead__title' : 'h2 shead__title'} delay={0.05} />
        {lead && (
          <Reveal variant="rise" delay={0.2}>
            <p className="lead shead__lead">{lead}</p>
          </Reveal>
        )}
      </div>
      {aside && (
        <Reveal variant="rise" delay={0.25} className="shead__aside">
          {aside}
        </Reveal>
      )}
    </header>
  )
}
