import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, whatsappGreeting, whatsappHref } from '../../data/site'
import { Logo } from '../ui/Logo'
import { Icon } from '../ui/Icon'
import { PremiumButton } from '../ui/PremiumButton'
import { setScrollLocked } from '../../lib/smoothScroll'
import { gsap } from '../../lib/gsap'
import { device } from '../../lib/device'
import './Navbar.css'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu on navigation (adjusted during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname)
  if (pathname !== menuPath) {
    setMenuPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    setScrollLocked(open)
    const menu = menuRef.current
    if (!menu) return
    if (open) {
      if (!device.reducedMotion) {
        gsap.fromTo(
          menu.querySelectorAll('[data-menu-item]'),
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.9, delay: 0.15 },
        )
      }
      menu.querySelector<HTMLElement>('a')?.focus()
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false)
          toggleRef.current?.focus()
        }
      }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="nav__inner">
          <Link to="/" className="nav__brand" aria-label="Orange Quantum Hub — home" data-cursor="hover">
            <Logo />
          </Link>

          <nav className="nav__links" aria-label="Primary">
            <ul role="list">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === '/'} className="nav__link" data-cursor="hover">
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__actions">
            <PremiumButton href={whatsappHref(whatsappGreeting)} variant="ghost" icon="arrow-right" className="nav__cta">
              Let&apos;s Talk
            </PremiumButton>
            <button
              ref={toggleRef}
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
              data-cursor="hover"
            >
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" ref={menuRef} className={`menu ${open ? 'is-open' : ''}`} inert={!open} role="dialog" aria-modal="true" aria-label="Site menu">
        <nav className="menu__inner" aria-label="Mobile">
          <ul role="list">
            {nav.map((item, i) => (
              <li key={item.to} className="menu__row">
                <NavLink to={item.to} end={item.to === '/'} className="menu__link" data-menu-item>
                  <span className="menu__num">0{i + 1}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="menu__foot" data-menu-item>
            <PremiumButton to="/contact" size="lg">
              Start a Project
            </PremiumButton>
          </div>
        </nav>
      </div>
    </>
  )
}
