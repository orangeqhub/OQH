/**
 * Single source of truth for site content.
 *
 * There was no previous codebase or CMS to import company data from, so this
 * file only contains positioning the company already uses publicly. It
 * deliberately contains NO statistics, client names, testimonials, awards,
 * addresses or phone numbers. Add real ones here when available — every page
 * reads from this file.
 */

export type IconName =
  | 'code'
  | 'globe'
  | 'phone'
  | 'megaphone'
  | 'film'
  | 'motion'
  | 'pen'
  | 'badge'
  | 'layers'
  | 'cpu'
  | 'spark'
  | 'shield'
  | 'users'
  | 'clock'
  | 'target'
  | 'loop'
  | 'cart'
  | 'heart'
  | 'book'
  | 'building'
  | 'bank'
  | 'plane'
  | 'factory'
  | 'rocket'
  | 'mail'
  | 'pin'

/** Visual used for a mini floating-interface mock (see components/3d/panels). */
export type PanelKind =
  | 'code'
  | 'web'
  | 'mobile'
  | 'analytics'
  | 'timeline'
  | 'motion'
  | 'brand'
  | 'identity'
  | 'wireframe'
  | 'systems'

export const company = {
  name: 'Orange Quantum Hub',
  legalName: 'Orange Quantum Hub Private Limited',
  shortName: 'OQH',
  tagline: 'Software, creativity and digital growth — under one roof.',
  positioning:
    'Orange Quantum Hub Private Limited is a technology-driven company delivering software development, digital marketing, creative content and design solutions that help businesses grow in the digital world.',
  pillars: ['Ideas', 'Technology', 'Creativity', 'Growth'],
}

/**
 * Contact channels. Configure through environment variables (see .env.example)
 * rather than hard-coding unverified details.
 */
export const contact = {
  /** Display format of the business number. */
  phone: '+91 81431 24242',
  /** International digits only (country code 91 + number) — used for tel: and wa.me links. */
  phoneDigits: '918143124242',
  email: (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? '',
  address: (import.meta.env.VITE_CONTACT_ADDRESS as string | undefined) ?? '',
}

/** Pre-filled greeting used by "Let's Talk" and the floating WhatsApp button. */
export const whatsappGreeting =
  "Hi Orange Quantum Hub! I found you through your website and I'd like to talk about a project."

export const phoneHref = `tel:+${contact.phoneDigits}`

/** wa.me link that opens a chat with the business, optionally with a pre-filled message. */
export function whatsappHref(message?: string) {
  const base = `https://wa.me/${contact.phoneDigits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Industries', to: '/industries' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
] as const

export interface Service {
  slug: string
  title: string
  short: string
  description: string
  icon: IconName
  panel: PanelKind
  /** Accent hue for the card's light — always warm-leaning or muted. */
  hue: string
  /** Photo (public/services/<slug>.webp — free-licence, see CREDITS.md). */
  image: string
  capabilities: string[]
}

export const services: Service[] = [
  {
    slug: 'custom-software',
    image: '/services/custom-software.webp',
    title: 'Custom Software Development',
    short: 'Software built around how your business actually works.',
    description:
      'From internal tools to customer-facing platforms, we design and engineer software that fits your operations, scales with your growth and stays maintainable.',
    icon: 'code',
    panel: 'code',
    hue: '#ff7a1a',
    capabilities: ['Business applications', 'APIs & integrations', 'Cloud architecture', 'Automation'],
  },
  {
    slug: 'web-development',
    image: '/services/web-development.webp',
    title: 'Web Development',
    short: 'Fast, accessible websites and web apps.',
    description:
      'Marketing sites, portals and full web applications — engineered for performance, search visibility and a polished experience on every screen.',
    icon: 'globe',
    panel: 'web',
    hue: '#ffa04d',
    capabilities: ['Corporate websites', 'Web applications', 'E-commerce', 'CMS & headless'],
  },
  {
    slug: 'mobile-apps',
    image: '/services/mobile-apps.webp',
    title: 'Mobile App Development',
    short: 'Native-feeling apps for iOS and Android.',
    description:
      'We plan, design and build mobile apps that feel at home on every device, backed by reliable APIs and thoughtful release processes.',
    icon: 'phone',
    panel: 'mobile',
    hue: '#6aa8ff',
    capabilities: ['iOS & Android', 'Cross-platform', 'App backends', 'Store release'],
  },
  {
    slug: 'digital-marketing',
    image: '/services/digital-marketing.webp',
    title: 'Digital Marketing',
    short: 'Campaigns measured by what they move.',
    description:
      'Search, social and performance campaigns planned around clear goals, with reporting that shows what is working and where to invest next.',
    icon: 'megaphone',
    panel: 'analytics',
    hue: '#ffb547',
    capabilities: ['SEO', 'Social media', 'Paid campaigns', 'Analytics & reporting'],
  },
  {
    slug: 'video-editing',
    image: '/services/video-editing.webp',
    title: 'Video Editing',
    short: 'Stories cut for attention.',
    description:
      'Promotional films, reels and product videos — edited, colour-graded and delivered in every format your channels need.',
    icon: 'film',
    panel: 'timeline',
    hue: '#ff6a5a',
    capabilities: ['Promo & brand films', 'Social reels', 'Colour grading', 'Sound & subtitles'],
  },
  {
    slug: 'motion-graphics',
    image: '/services/motion-graphics.webp',
    title: 'Motion Graphics',
    short: 'Ideas that move — literally.',
    description:
      'Animated explainers, logo reveals and UI motion that make complex ideas simple and brands memorable.',
    icon: 'motion',
    panel: 'motion',
    hue: '#8f7bff',
    capabilities: ['Explainer animation', 'Logo animation', 'Kinetic type', 'UI motion'],
  },
  {
    slug: 'graphic-design',
    image: '/services/graphic-design.webp',
    title: 'Graphic Design',
    short: 'Visual communication with intent.',
    description:
      'Campaign creatives, social content, print and presentation design crafted to be consistent, on-brand and effective.',
    icon: 'pen',
    panel: 'brand',
    hue: '#ff8a2b',
    capabilities: ['Social creatives', 'Print & packaging', 'Presentations', 'Illustration'],
  },
  {
    slug: 'branding',
    image: '/services/branding.webp',
    title: 'Branding',
    short: 'Identities built to last.',
    description:
      'Naming support, logo systems, typography, colour and guidelines — a complete identity your team can apply with confidence.',
    icon: 'badge',
    panel: 'identity',
    hue: '#ffb547',
    capabilities: ['Logo systems', 'Brand guidelines', 'Visual language', 'Brand collateral'],
  },
  {
    slug: 'ui-ux',
    image: '/services/ui-ux.webp',
    title: 'UI/UX Design',
    short: 'Interfaces people understand instantly.',
    description:
      'Research, wireframes, prototypes and design systems that make products intuitive — validated before a line of production code is written.',
    icon: 'layers',
    panel: 'wireframe',
    hue: '#4fd6e6',
    capabilities: ['User research', 'Wireframes', 'Prototyping', 'Design systems'],
  },
  {
    slug: 'it-solutions',
    image: '/services/it-solutions.webp',
    title: 'IT & Digital Solutions',
    short: 'The digital backbone for modern teams.',
    description:
      'Consulting, digital transformation, hosting and ongoing support so your technology keeps pace with your ambitions.',
    icon: 'cpu',
    panel: 'systems',
    hue: '#ff7a1a',
    capabilities: ['Digital transformation', 'Cloud & hosting', 'Maintenance & support', 'Technology consulting'],
  },
]

export const values = [
  { title: 'Innovation', text: 'Solutions tailored to your business, not templates.', icon: 'spark' as IconName },
  { title: 'Quality', text: 'Reviewed, tested and refined before it ships.', icon: 'shield' as IconName },
  { title: 'Creativity', text: 'Design and storytelling that earn attention.', icon: 'pen' as IconName },
  { title: 'Reliability', text: 'Clear timelines and honest communication.', icon: 'clock' as IconName },
  { title: 'Client Focus', text: 'Your goals set the direction of the work.', icon: 'target' as IconName },
  { title: 'Continuous Improvement', text: 'Long-term partnership for continuous growth.', icon: 'loop' as IconName },
]

export const process = [
  { step: '01', title: 'Discover', text: 'We learn your business, audience and goals, and agree on what success looks like.' },
  { step: '02', title: 'Design', text: 'Strategy becomes flows, interfaces, identities and storyboards you can react to early.' },
  { step: '03', title: 'Build', text: 'Engineers, editors and designers produce the work in short, reviewable iterations.' },
  { step: '04', title: 'Grow', text: 'We launch, measure and keep improving alongside your team.' },
]

export interface Industry {
  title: string
  text: string
  icon: IconName
  focus: string[]
}

export const industries: Industry[] = [
  { title: 'Retail & E-commerce', icon: 'cart', text: 'Storefronts, catalogues and campaigns that turn browsing into buying.', focus: ['Online stores', 'Product content', 'Performance ads'] },
  { title: 'Healthcare & Wellness', icon: 'heart', text: 'Patient-friendly portals, booking flows and clear health communication.', focus: ['Appointment systems', 'Patient apps', 'Awareness campaigns'] },
  { title: 'Education & E-learning', icon: 'book', text: 'Learning platforms and engaging course content for every device.', focus: ['LMS platforms', 'Course video', 'Student apps'] },
  { title: 'Real Estate & Construction', icon: 'building', text: 'Listing platforms, walkthrough videos and lead generation.', focus: ['Property portals', 'Project films', 'Lead funnels'] },
  { title: 'Finance & Fintech', icon: 'bank', text: 'Secure, compliant interfaces and data-rich dashboards.', focus: ['Dashboards', 'Onboarding flows', 'Trust-led branding'] },
  { title: 'Travel & Hospitality', icon: 'plane', text: 'Booking experiences and visual storytelling that sell the destination.', focus: ['Booking engines', 'Destination video', 'Social content'] },
  { title: 'Manufacturing & Logistics', icon: 'factory', text: 'Operational software and automation for complex supply chains.', focus: ['Inventory systems', 'Tracking tools', 'Process automation'] },
  { title: 'Startups & Scale-ups', icon: 'rocket', text: 'From first MVP and brand to launch campaigns and scale.', focus: ['MVP development', 'Brand identity', 'Launch marketing'] },
]

export interface Project {
  slug: string
  /** Client / brand name as shown on the live site. */
  title: string
  /** Short description of what was built. */
  category: string
  filter: 'education' | 'travel' | 'realestate' | 'ecommerce' | 'services'
  industry: string
  url: string
  /**
   * Whether to show a "Visit live site" link. venkateshinteriors.online had an
   * expired SSL certificate when these screenshots were taken (Sept 2026), so
   * visitors would see a browser security warning — re-enable once renewed.
   */
  liveLink: boolean
  /** Screenshots of the live site: public/projects/<slug>-desktop|mobile.webp */
  images: { desktop: string; mobile: string }
  summary: string
  /** Features visible on the live site. */
  highlights: string[]
  deliverables: string[]
}

export const projectFilters = [
  { key: 'all', label: 'All' },
  { key: 'realestate', label: 'Real Estate' },
  { key: 'travel', label: 'Travel & Tours' },
  { key: 'ecommerce', label: 'E-commerce' },
  { key: 'education', label: 'Education' },
  { key: 'services', label: 'Local Business' },
] as const

const shots = (slug: string) => ({ desktop: `/projects/${slug}-desktop.webp`, mobile: `/projects/${slug}-mobile.webp` })

/** Client websites designed and developed by Orange Quantum Hub. */
export const projects: Project[] = [
  {
    slug: 'merit',
    title: 'Merit Real Solutions',
    category: 'Property portal · Web application',
    filter: 'realestate',
    industry: 'Real Estate',
    url: 'https://meritrealsolutions.in/',
    liveLink: true,
    images: shots('merit'),
    summary: 'A property marketplace where buyers search verified listings by location and budget, and owners post properties for sale.',
    highlights: [
      'Location and price-range property search',
      'Property categories, map layouts and developments',
      'Featured, latest and location-based listings',
      'Sell / post-a-property flow and user login',
    ],
    deliverables: ['Web application design & development', 'Responsive mobile experience', 'Listings & search'],
  },
  {
    slug: 'omkareswar',
    title: 'Omkareswar Realtors',
    category: 'Real estate website · Ventures & listings',
    filter: 'realestate',
    industry: 'Real Estate',
    url: 'https://omkareswarrealtors.com/home',
    liveLink: true,
    images: shots('omkareswar'),
    summary: 'A real estate platform for verified plots, apartments and ventures across Andhra Pradesh and Telangana.',
    highlights: [
      'Search by location, category and price',
      'Venture showcase with featured and latest properties',
      'Buy and sell property journeys',
      'Lead capture for property enquiries',
    ],
    deliverables: ['Website design & development', 'Responsive mobile experience', 'Lead capture'],
  },
  {
    slug: 'bejawada',
    title: 'Bejawada Overseas Education',
    category: 'Study-abroad consultancy website',
    filter: 'education',
    industry: 'Education',
    url: 'https://www.bejawadaoverseas.in/',
    liveLink: true,
    images: shots('bejawada'),
    summary: 'The online home of a Narasaraopet study-abroad consultancy — destinations, universities and every stage of the application journey.',
    highlights: [
      'Study destinations and partner universities',
      'Service pages from course selection to visa documentation',
      'Student success stories and blog',
      'Free-consultation booking and WhatsApp contact',
    ],
    deliverables: ['Website design & development', 'Responsive mobile experience', 'Content structure'],
  },
  {
    slug: 'surgical',
    title: 'Surgical World',
    category: 'E-commerce store · Medical equipment',
    filter: 'ecommerce',
    industry: 'Healthcare Retail',
    url: 'https://surgicalworld.org/',
    liveLink: true,
    images: shots('surgical'),
    summary: 'An online store for surgical and medical equipment, supplying hospitals, clinics and homes.',
    highlights: [
      'Product catalogue with category browsing',
      'Product search, wishlist and cart',
      'Best-selling products showcase',
      'Customer login and WhatsApp ordering',
    ],
    deliverables: ['E-commerce design & development', 'Responsive mobile experience', 'Product catalogue'],
  },
  {
    slug: 'arshi',
    title: 'Arshi Naturals',
    category: 'E-commerce store · Homemade foods',
    filter: 'ecommerce',
    industry: 'Food & FMCG',
    url: 'https://arshinaturals.com/',
    liveLink: true,
    images: shots('arshi'),
    summary: 'An online shop for homemade pickles, snacks and sweets made with traditional recipes and delivered to the doorstep.',
    highlights: [
      'Shop by category and product catalogue',
      'Product search, wishlist and cart',
      'Brand story and quality promises',
      'Newsletter sign-up and WhatsApp contact',
    ],
    deliverables: ['E-commerce design & development', 'Responsive mobile experience', 'Brand presentation'],
  },
  {
    slug: 'nyra',
    title: 'Nyra Tours & Travels',
    category: 'Travel booking website',
    filter: 'travel',
    industry: 'Travel & Tourism',
    url: 'https://www.nyratoursandtravels.online/',
    liveLink: true,
    images: shots('nyra'),
    summary: 'A travel agency website for flight bookings, cargo and curated devotional tour packages.',
    highlights: [
      'Destinations and tour packages',
      'Visa, hotel, passport, forex and cruise services',
      'Sabarimala and Velankanni pilgrimage tours',
      'Book-now and WhatsApp enquiries',
    ],
    deliverables: ['Website design & development', 'Responsive mobile experience', 'Booking enquiries'],
  },
  {
    slug: 'gootours',
    title: 'Goo Tours Travels & Cargo',
    category: 'Travel & cargo website',
    filter: 'travel',
    industry: 'Travel & Logistics',
    url: 'https://gootourstravels.online/',
    liveLink: true,
    images: shots('gootours'),
    summary: 'A website for domestic and international travel bookings, cargo services and devotional tour packages.',
    highlights: [
      'Flight, bus and train ticketing',
      'Cargo, parcel and ship cargo services',
      'Devotional tours — Shirdi, Tirupati, Srisailam, Annavaram, Sabarimala',
      'Click-to-call and ticket booking',
    ],
    deliverables: ['Website design & development', 'Responsive mobile experience'],
  },
  {
    slug: 'venkatesh',
    title: 'Venkatesh Interiors',
    category: 'Interior design business website',
    filter: 'services',
    industry: 'Interiors & Home Improvement',
    url: 'https://venkateshinteriors.online/',
    liveLink: false,
    images: shots('venkatesh'),
    summary: 'A showcase website for a Guntur interior-solutions business serving homes and offices.',
    highlights: [
      'Service pages — PVC and gypsum ceilings, modular kitchens, wallpapers, blinds, painting',
      'Product collections from partner brands',
      'Why-choose-us and pricing promises',
      'Contact and enquiry flow',
    ],
    deliverables: ['Website design & development', 'Responsive mobile experience'],
  },
]

export const careers = {
  intro:
    'We are a multidisciplinary team of developers, designers, marketers and creatives. If you care about craft and enjoy learning across disciplines, we would like to hear from you.',
  disciplines: [
    { title: 'Engineering', text: 'Web, mobile and backend developers who enjoy shipping clean, reliable software.', icon: 'code' as IconName },
    { title: 'Design', text: 'UI/UX and graphic designers who think in systems and sweat the details.', icon: 'layers' as IconName },
    { title: 'Marketing', text: 'Strategists and specialists who connect creative work to measurable outcomes.', icon: 'megaphone' as IconName },
    { title: 'Video & Motion', text: 'Editors and motion designers who know how to hold attention.', icon: 'film' as IconName },
  ],
  principles: [
    { title: 'Craft over shortcuts', text: 'We take pride in work that is well made, inside and out.' },
    { title: 'Learn across disciplines', text: 'Developers, designers and marketers work side by side on the same projects.' },
    { title: 'Ownership', text: 'Everyone has a voice in how the work is shaped and delivered.' },
  ],
}
