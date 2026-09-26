import type { PanelKind } from '../../../data/site'
import './panels.css'

/**
 * Miniature, fully-DOM interface mocks. They scale with their container
 * (container query units), so the same visual works as a hero panel, a card
 * thumbnail or a full project cover — crisp at any size, no image assets.
 */
export function PanelVisual({ kind }: { kind: PanelKind }) {
  return (
    <div className={`pv pv--${kind}`} aria-hidden="true">
      <div className="pv__inner">{renderKind(kind)}</div>
    </div>
  )
}

function renderKind(kind: PanelKind) {
  switch (kind) {
    case 'code':
      return <CodeMock />
    case 'web':
      return <WebMock />
    case 'mobile':
      return <MobileMock />
    case 'analytics':
      return <AnalyticsMock />
    case 'timeline':
      return <TimelineMock />
    case 'motion':
      return <MotionMock />
    case 'brand':
      return <BrandMock />
    case 'identity':
      return <IdentityMock />
    case 'wireframe':
      return <WireframeMock />
    case 'systems':
      return <SystemsMock />
  }
}

const codeLines: [number, string, string][] = [
  // [indent, token class sequence, text] — kept tiny and decorative
  [0, 'k', 'export async function'],
  [1, 'f', 'buildExperience(brief) {'],
  [2, 'v', 'const plan = await discover(brief)'],
  [2, 'v', 'const ui = design(plan.flows)'],
  [2, 's', "deploy(ui, { region: 'edge' })"],
  [2, 'k', 'return grow(ui)'],
  [1, 'p', '}'],
]

function CodeMock() {
  return (
    <div className="m-code">
      <div className="m-code__tabs">
        <span className="is-on">experience.ts</span>
        <span>api.ts</span>
        <span>schema.sql</span>
      </div>
      <div className="m-code__body">
        {codeLines.map(([indent, tone, text], i) => (
          <div className="m-code__line" key={i} style={{ ['--i' as string]: i }}>
            <span className="m-code__ln">{i + 1}</span>
            <span className={`m-code__t m-code__t--${tone}`} style={{ paddingLeft: `${indent * 1.2}em` }}>
              {text}
            </span>
          </div>
        ))}
        <span className="m-code__caret" />
      </div>
      <div className="m-code__term">
        <span className="m-code__prompt">$</span> npm run build <span className="m-code__ok">✓ ready</span>
      </div>
    </div>
  )
}

function WebMock() {
  return (
    <div className="m-web">
      <div className="m-web__bar">
        <i />
        <i />
        <i />
        <span className="m-web__url">https://</span>
      </div>
      <div className="m-web__page">
        <div className="m-web__nav">
          <b />
          <span />
          <span />
          <span />
        </div>
        <div className="m-web__hero">
          <div>
            <span className="m-web__h" />
            <span className="m-web__h m-web__h--short" />
            <span className="m-web__cta" />
          </div>
          <div className="m-web__art" />
        </div>
        <div className="m-web__cards">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

function MobileMock() {
  return (
    <div className="m-mob">
      <div className="m-mob__phone">
        <div className="m-mob__notch" />
        <div className="m-mob__head">
          <span className="m-mob__avatar" />
          <span className="m-mob__line" />
        </div>
        <div className="m-mob__hero" />
        <div className="m-mob__list">
          <span />
          <span />
          <span />
        </div>
        <div className="m-mob__tabs">
          <i className="is-on" />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="m-mob__phone m-mob__phone--back">
        <div className="m-mob__grid">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

const bars = [38, 52, 44, 63, 58, 72, 66, 84, 78, 92]

function AnalyticsMock() {
  return (
    <div className="m-ana">
      <div className="m-ana__head">
        <div>
          <span className="m-ana__label">Conversions</span>
          <span className="m-ana__trend">▲ trending up</span>
        </div>
        <div className="m-ana__donut" />
      </div>
      <svg className="m-ana__line" viewBox="0 0 200 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="anaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff7a1a" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 50 C20 46 30 40 50 42 S80 30 100 28 S140 22 160 14 S190 8 200 4 L200 60 L0 60Z" fill="url(#anaFill)" />
        <path className="m-ana__stroke" d="M0 50 C20 46 30 40 50 42 S80 30 100 28 S140 22 160 14 S190 8 200 4" fill="none" stroke="#ffa04d" strokeWidth="2" />
      </svg>
      <div className="m-ana__bars">
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%`, ['--i' as string]: i }} />
        ))}
      </div>
      <div className="m-ana__chips">
        <span>Search</span>
        <span>Social</span>
        <span>Ads</span>
      </div>
    </div>
  )
}

function TimelineMock() {
  return (
    <div className="m-tl">
      <div className="m-tl__preview">
        <div className="m-tl__scene" />
        <span className="m-tl__play" />
        <span className="m-tl__tc">00:00:12:08</span>
      </div>
      <div className="m-tl__tracks">
        <div className="m-tl__track">
          <span style={{ left: '2%', width: '28%' }} />
          <span style={{ left: '32%', width: '22%' }} />
          <span style={{ left: '56%', width: '40%' }} />
        </div>
        <div className="m-tl__track m-tl__track--b">
          <span style={{ left: '10%', width: '18%' }} />
          <span style={{ left: '40%', width: '30%' }} />
        </div>
        <div className="m-tl__track m-tl__track--a">
          <span style={{ left: '0%', width: '96%' }} />
        </div>
        <span className="m-tl__head" />
      </div>
    </div>
  )
}

function MotionMock() {
  return (
    <div className="m-mo">
      <svg viewBox="0 0 200 120" className="m-mo__svg">
        <g className="m-mo__grid">
          {[20, 40, 60, 80, 100].map((y) => (
            <line key={y} x1="0" x2="200" y1={y} y2={y} />
          ))}
        </g>
        <path id="moPath" d="M10 100 C60 100 70 20 110 20 S170 60 190 30" fill="none" stroke="#8f7bff" strokeWidth="2" />
        <line x1="10" y1="100" x2="55" y2="100" className="m-mo__handle" />
        <line x1="110" y1="20" x2="150" y2="20" className="m-mo__handle" />
        <circle cx="10" cy="100" r="4" className="m-mo__key" />
        <circle cx="110" cy="20" r="4" className="m-mo__key" />
        <circle cx="190" cy="30" r="4" className="m-mo__key" />
        <circle r="6" className="m-mo__dot">
          <animateMotion dur="3.2s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
            <mpath href="#moPath" />
          </animateMotion>
        </circle>
      </svg>
      <div className="m-mo__keys">
        <span>Position</span>
        <span>Scale</span>
        <span>Opacity</span>
      </div>
    </div>
  )
}

function BrandMock() {
  return (
    <div className="m-br">
      <div className="m-br__poster">
        <span className="m-br__aa">Aa</span>
        <span className="m-br__sub">Display / 600</span>
      </div>
      <div className="m-br__side">
        <div className="m-br__swatches">
          <i style={{ background: '#ff7a1a' }} />
          <i style={{ background: '#ffb547' }} />
          <i style={{ background: '#f4f2ee' }} />
          <i style={{ background: '#1a1f2b' }} />
        </div>
        <div className="m-br__type">
          <span />
          <span />
          <span />
        </div>
        <div className="m-br__shape" />
      </div>
    </div>
  )
}

function IdentityMock() {
  return (
    <div className="m-id">
      <div className="m-id__card m-id__card--back" />
      <div className="m-id__card">
        <svg viewBox="0 0 40 40" className="m-id__mark">
          <circle cx="20" cy="20" r="12" fill="none" stroke="#ff7a1a" strokeWidth="4" />
          <circle cx="32" cy="9" r="2.5" fill="#ffb547" />
        </svg>
        <span className="m-id__line" />
        <span className="m-id__line m-id__line--short" />
      </div>
      <div className="m-id__grid">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function WireframeMock() {
  return (
    <div className="m-wf">
      <div className="m-wf__desk">
        <span className="m-wf__blk m-wf__blk--nav" />
        <span className="m-wf__blk m-wf__blk--hero" />
        <span className="m-wf__blk" />
        <span className="m-wf__blk" />
        <span className="m-wf__blk" />
      </div>
      <svg className="m-wf__flow" viewBox="0 0 40 40" preserveAspectRatio="none">
        <path d="M0 20 H40" />
      </svg>
      <div className="m-wf__phone">
        <span className="m-wf__blk m-wf__blk--hero" />
        <span className="m-wf__blk" />
        <span className="m-wf__blk" />
        <span className="m-wf__tap" />
      </div>
    </div>
  )
}

function SystemsMock() {
  const nodes = [
    { x: 50, y: 14, label: 'App' },
    { x: 18, y: 50, label: 'API' },
    { x: 82, y: 50, label: 'Auth' },
    { x: 34, y: 86, label: 'DB' },
    { x: 66, y: 86, label: 'Cloud' },
  ]
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 4],
  ]
  return (
    <div className="m-sys">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="m-sys__edges">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} style={{ ['--i' as string]: i }} />
        ))}
      </svg>
      {nodes.map((n) => (
        <span key={n.label} className="m-sys__node" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
          {n.label}
        </span>
      ))}
    </div>
  )
}
