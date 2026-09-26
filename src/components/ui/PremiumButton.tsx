import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic } from '../../hooks/useMagnetic'
import { Icon } from './Icon'
import './PremiumButton.css'

type Variant = 'primary' | 'ghost' | 'text'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  icon?: 'arrow-right' | 'arrow-up-right' | 'play' | 'mail' | 'none'
  size?: 'md' | 'lg'
  className?: string
}

type Props =
  | (BaseProps & { to: string; href?: never; onClick?: never; type?: never; disabled?: never })
  | (BaseProps & { href: string; to?: never; onClick?: never; type?: never; disabled?: never })
  | (BaseProps & {
      to?: never
      href?: never
      onClick?: () => void
      type?: 'button' | 'submit'
      disabled?: boolean
    })

/** Magnetic pill button with a light sweep and travelling arrow. */
export function PremiumButton(props: Props) {
  const { children, variant = 'primary', icon = 'arrow-right', size = 'md', className = '' } = props
  const ref = useMagnetic<HTMLSpanElement>(variant === 'text' ? 0.15 : 0.28)
  const cls = `pbtn pbtn--${variant} pbtn--${size} ${className}`

  const inner = (
    <>
      <span className="pbtn__sweep" aria-hidden="true" />
      {icon === 'play' && (
        <span className="pbtn__play" aria-hidden="true">
          <Icon name="play" size={14} />
        </span>
      )}
      <span className="pbtn__label">{children}</span>
      {icon !== 'none' && icon !== 'play' && (
        <span className="pbtn__icon" aria-hidden="true">
          <Icon name={icon} size={17} />
          <Icon name={icon} size={17} />
        </span>
      )}
    </>
  )

  let el: ReactNode
  if ('to' in props && props.to) {
    el = (
      <Link to={props.to} className={cls} data-cursor="hover">
        {inner}
      </Link>
    )
  } else if ('href' in props && props.href) {
    el = (
      <a
        href={props.href}
        className={cls}
        data-cursor="hover"
        {...(/^https?:/.test(props.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  } else {
    el = (
      <button
        type={props.type ?? 'button'}
        className={cls}
        onClick={props.onClick}
        disabled={props.disabled}
        data-cursor="hover"
      >
        {inner}
      </button>
    )
  }

  return (
    <span ref={ref} className="pbtn-wrap">
      {el}
    </span>
  )
}
