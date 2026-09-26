import * as THREE from 'three'

/**
 * Procedurally drawn screen contents for monitors and holographic panels.
 * Canvas textures keep the scene asset-free (no downloads, no broken images)
 * while still reading as real software on real screens.
 */
export type ScreenVariant = 'code' | 'dashboard' | 'timeline' | 'design' | 'mobile'

const cache = new Map<string, THREE.CanvasTexture>()

const ORANGE = '#ff7a1a'
const AMBER = '#ffb547'
const COOL = '#6aa8ff'
const VIOLET = '#8f7bff'

/** Tiny seeded PRNG so procedural layouts are identical on every visit. */
export function rand(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function screenTexture(variant: ScreenVariant, w = 512, h = 320, seed = 7): THREE.CanvasTexture {
  const key = `${variant}-${w}-${h}-${seed}`
  const hit = cache.get(key)
  if (hit) return hit

  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  const r = rand(seed)

  // base
  const bg = g.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#0d1220')
  bg.addColorStop(1, '#070a12')
  g.fillStyle = bg
  g.fillRect(0, 0, w, h)

  const u = w / 100 // unit

  switch (variant) {
    case 'code': {
      g.fillStyle = 'rgba(255,255,255,0.05)'
      g.fillRect(0, 0, w, 7 * u)
      g.fillStyle = ORANGE
      g.fillRect(2 * u, 6.2 * u, 14 * u, 0.8 * u)
      const colors = ['#ff9a5a', '#ffd08a', '#c9d4ff', '#8fe3c0', 'rgba(255,255,255,0.35)']
      let y = 11 * u
      while (y < h - 4 * u) {
        const indent = Math.floor(r() * 4) * 4 * u
        let x = 8 * u + indent
        const tokens = 1 + Math.floor(r() * 4)
        for (let i = 0; i < tokens; i++) {
          const len = (4 + r() * 16) * u
          g.fillStyle = colors[Math.floor(r() * colors.length)]
          g.globalAlpha = 0.85
          g.fillRect(x, y, len, 1.4 * u)
          x += len + 2 * u
        }
        g.globalAlpha = 0.25
        g.fillStyle = '#fff'
        g.fillRect(2.5 * u, y, 2 * u, 1.4 * u)
        g.globalAlpha = 1
        y += 3.6 * u
      }
      break
    }
    case 'dashboard': {
      // KPI tiles
      for (let i = 0; i < 3; i++) {
        g.fillStyle = 'rgba(255,255,255,0.06)'
        g.fillRect((4 + i * 32) * u, 4 * u, 28 * u, 12 * u)
        g.fillStyle = i === 0 ? ORANGE : 'rgba(255,255,255,0.7)'
        g.fillRect((7 + i * 32) * u, 8 * u, (10 + r() * 8) * u, 3 * u)
      }
      // line chart
      g.strokeStyle = AMBER
      g.lineWidth = 0.7 * u
      g.shadowColor = ORANGE
      g.shadowBlur = 2 * u
      g.beginPath()
      for (let i = 0; i <= 20; i++) {
        const x = (4 + i * 4.6) * u
        const yy = h * 0.55 - i * 1.1 * u - r() * 6 * u
        if (i === 0) g.moveTo(x, yy)
        else g.lineTo(x, yy)
      }
      g.stroke()
      g.shadowBlur = 0
      // bars
      for (let i = 0; i < 16; i++) {
        const bh = (6 + r() * 20) * u * (0.5 + i / 24)
        g.fillStyle = i % 2 ? COOL : ORANGE
        g.globalAlpha = 0.75
        g.fillRect((4 + i * 5.8) * u, h - 4 * u - bh, 3.6 * u, bh)
      }
      g.globalAlpha = 1
      break
    }
    case 'timeline': {
      // preview frame
      const pv = g.createLinearGradient(0, 0, 0, h * 0.55)
      pv.addColorStop(0, '#2b1a2e')
      pv.addColorStop(0.6, ORANGE)
      pv.addColorStop(1, '#3a1606')
      g.fillStyle = pv
      g.fillRect(20 * u, 3 * u, 60 * u, h * 0.52)
      g.fillStyle = 'rgba(0,0,0,0.6)'
      g.beginPath()
      g.ellipse(50 * u, h * 0.42, 9 * u, 12 * u, 0, 0, Math.PI * 2)
      g.fill()
      // tracks
      const trackColors = [ORANGE, VIOLET, '#4fd6e6']
      for (let t = 0; t < 3; t++) {
        const ty = h * 0.62 + t * 7 * u
        g.fillStyle = 'rgba(255,255,255,0.05)'
        g.fillRect(3 * u, ty, 94 * u, 5 * u)
        let x = 3 * u + r() * 6 * u
        while (x < 90 * u) {
          const len = (8 + r() * 22) * u
          g.fillStyle = trackColors[t]
          g.globalAlpha = 0.8
          g.fillRect(x, ty + 0.6 * u, Math.min(len, 97 * u - x), 3.8 * u)
          x += len + (1 + r() * 5) * u
        }
        g.globalAlpha = 1
      }
      g.fillStyle = '#fff'
      g.fillRect(38 * u, h * 0.6, 0.5 * u, 23 * u)
      break
    }
    case 'design': {
      const art = g.createRadialGradient(w * 0.3, h * 0.35, 0, w * 0.3, h * 0.35, w * 0.35)
      art.addColorStop(0, AMBER)
      art.addColorStop(0.5, ORANGE)
      art.addColorStop(1, '#3a1606')
      g.fillStyle = art
      g.fillRect(4 * u, 4 * u, 50 * u, h - 8 * u)
      g.fillStyle = 'rgba(20,10,0,0.85)'
      g.font = `700 ${22 * u}px sans-serif`
      g.fillText('Aa', 8 * u, h - 12 * u)
      const sw = [ORANGE, AMBER, '#f4f2ee', '#1a1f2b', COOL]
      sw.forEach((col, i) => {
        g.fillStyle = col
        g.fillRect((58 + i * 7.6) * u, 6 * u, 6 * u, 6 * u)
      })
      for (let i = 0; i < 5; i++) {
        g.fillStyle = `rgba(255,255,255,${i === 0 ? 0.7 : 0.25})`
        g.fillRect(58 * u, (18 + i * 5) * u, (36 - i * 4) * u, 1.8 * u)
      }
      g.strokeStyle = 'rgba(255,255,255,0.3)'
      g.setLineDash([u, u])
      g.strokeRect(58 * u, 44 * u, 36 * u, h - 48 * u)
      break
    }
    case 'mobile': {
      for (let i = 0; i < 3; i++) {
        const x = (8 + i * 31) * u
        g.fillStyle = '#1a2030'
        g.fillRect(x, 4 * u, 24 * u, h - 8 * u)
        g.fillStyle = i === 1 ? ORANGE : COOL
        g.globalAlpha = 0.6
        g.fillRect(x + 2 * u, 8 * u, 20 * u, 18 * u)
        g.globalAlpha = 1
        for (let j = 0; j < 4; j++) {
          g.fillStyle = 'rgba(255,255,255,0.12)'
          g.fillRect(x + 2 * u, (30 + j * 7) * u, 20 * u, 5 * u)
        }
      }
      break
    }
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  cache.set(key, tex)
  return tex
}

/** Vertical night-sky gradient with a warm city glow at the horizon. */
export function skyTexture(): THREE.CanvasTexture {
  const hit = cache.get('sky')
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#05070c')
  grad.addColorStop(0.42, '#0d1424')
  grad.addColorStop(0.56, '#3a2416')
  grad.addColorStop(0.6, '#6b3a17')
  grad.addColorStop(0.64, '#2a1a12')
  grad.addColorStop(1, '#040507')
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  cache.set('sky', tex)
  return tex
}

/** Soft round sprite for bokeh and dust. */
export function glowSprite(): THREE.CanvasTexture {
  const hit = cache.get('glow')
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.55)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  cache.set('glow', tex)
  return tex
}
