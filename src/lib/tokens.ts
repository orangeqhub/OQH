/**
 * JS-side mirror of the motion/colour tokens in src/styles/tokens.css.
 * GSAP and three.js cannot read CSS custom properties cheaply every frame,
 * so the values they need live here.
 */

export const colors = {
  void: '#05070b',
  ink: '#080b12',
  navy: '#0b1120',
  accent: '#ff7a1a',
  accentHi: '#ffa04d',
  amber: '#ffb547',
  cool: '#6aa8ff',
  violet: '#8f7bff',
  text: '#f4f2ee',
} as const

export const ease = {
  out: 'expo.out',
  outSoft: 'power3.out',
  inOut: 'power3.inOut',
  cine: 'expo.inOut',
} as const

export const duration = {
  fast: 0.18,
  base: 0.36,
  slow: 0.7,
  cine: 1.2,
} as const

/** How far layers drift with the pointer, in px, by depth. Kept small on purpose. */
export const parallax = {
  back: 8,
  mid: 18,
  front: 30,
} as const
