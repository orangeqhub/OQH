import './Logo.css'

/**
 * Official Orange Quantum Hub logo (public/brand/). The source artwork has a
 * dark-navy "QHub" that disappears on this dark site, so the wordmark uses an
 * on-dark variant where only that text is lifted to white; the OQH monogram
 * keeps its original colours.
 *
 *  - variant="nav":  monogram + wordmark lockup (header)
 *  - variant="mark": monogram only
 *  - variant="full": stacked monogram + wordmark (footer, transitions)
 */
export function Logo({ variant = 'nav' }: { variant?: 'nav' | 'mark' | 'full' }) {
  if (variant === 'full') {
    return (
      <span className="logo logo--full">
        <img src="/brand/oqh-logo-on-dark.png" alt="Orange Quantum Hub" width={570} height={407} />
      </span>
    )
  }
  return (
    <span className={`logo logo--${variant}`}>
      <img className="logo__mark" src="/brand/oqh-mark.png" alt={variant === 'mark' ? 'Orange Quantum Hub' : ''} width={532} height={242} />
      {variant === 'nav' && (
        <img className="logo__word" src="/brand/oqh-wordmark-on-dark.png" alt="Orange Quantum Hub" width={570} height={145} />
      )}
    </span>
  )
}
