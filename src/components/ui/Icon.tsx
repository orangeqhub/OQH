import type { IconName } from '../../data/site'

type Name = IconName | 'arrow-right' | 'arrow-up-right' | 'arrow-left' | 'play' | 'menu' | 'close' | 'check' | 'grid' | 'plus'

const paths: Record<Name, string> = {
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
  phone: 'M8 2.5h8a2 2 0 012 2v15a2 2 0 01-2 2H8a2 2 0 01-2-2v-15a2 2 0 012-2zM10.5 18.5h3',
  megaphone: 'M3 10v4a1 1 0 001 1h3l6 4V5L7 9H4a1 1 0 00-1 1zM17 8.5a5 5 0 010 7M8 15l1.5 5',
  film: 'M4 5h16v14H4zM4 9h16M4 15h16M8 5v4M12 5v4M16 5v4M8 15v4M12 15v4M16 15v4',
  motion: 'M4 16c3-8 6-8 8 0s5 8 8 0M4 8h3M17 8h3',
  pen: 'M4 20l4.5-1 10-10a2.1 2.1 0 00-3-3l-10 10L4 20zM13.5 7.5l3 3',
  badge: 'M12 3l2.4 1.8 3 .1.9 2.9 2.2 2-1 2.9.6 3-2.6 1.6-1.3 2.7-3-.4L12 21l-2.2-1.4-3 .4-1.3-2.7L2.9 15.7l.6-3-1-2.9 2.2-2 .9-2.9 3-.1L12 3zM9 12l2 2 4-4',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 4.5 9-4.5',
  cpu: 'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3zM8.5 12l2.5 2.5 4.5-5',
  users: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.2a3.5 3.5 0 010 6.6M18 14a6.5 6.5 0 013.5 6',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3.5 2',
  target: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z',
  loop: 'M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5',
  cart: 'M3 4h2.5l2.2 11h10.6L20.5 7H6.5M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z',
  heart: 'M12 20s-7.5-4.6-9-9.5C2 7 4.3 4.5 7.2 4.5c2 0 3.6 1.2 4.8 3 1.2-1.8 2.8-3 4.8-3C19.7 4.5 22 7 21 10.5 19.5 15.4 12 20 12 20z',
  book: 'M4 5a2 2 0 012-2h13v15H6a2 2 0 00-2 2V5zM4 20a2 2 0 002 2h13v-4M9 7h6',
  building: 'M4 21V5l8-3v19M12 8h8v13M8 7v.01M8 11v.01M8 15v.01M16 12v.01M16 16v.01M2 21h20',
  bank: 'M3 9l9-5 9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 21h18',
  plane: 'M10.5 13.5L3 11l1.5-1.5 8 1 4.5-4.5a2 2 0 013 3L15.5 13.5l1 8L15 23l-2.5-7.5L9 19v3l-1.5 1L6 19l-4-1.5 1-1.5h3l3.5-3.5z',
  factory: 'M3 21V10l5 3V10l5 3V10l5 3V4h3v17H3zM7 17h2M12 17h2M17 17h2',
  rocket: 'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c1.5-4.5 5-9 12-9 0 7-4.5 10.5-9 12zM15 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM6 12H3l2.5-3.5M12 18v3l3.5-2.5',
  mail: 'M3 6h18v12H3zM3 7l9 6.5L21 7',
  pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  'arrow-right': 'M4 12h15M13 6l6 6-6 6',
  'arrow-left': 'M20 12H5M11 6l-6 6 6 6',
  'arrow-up-right': 'M7 17L17 7M8 7h9v9',
  play: 'M8 5.5v13l11-6.5-11-6.5z',
  menu: 'M4 8h16M4 16h16',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  grid: 'M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01',
  plus: 'M12 5v14M5 12h14',
}

interface Props {
  name: Name
  size?: number
  className?: string
  strokeWidth?: number
}

export function Icon({ name, size = 20, className, strokeWidth = 1.6 }: Props) {
  const isGrid = name === 'grid'
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={isGrid ? 3 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  )
}
