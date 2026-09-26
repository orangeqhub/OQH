import type { ScenePreset } from '../../lib/sceneStore'

/**
 * Camera keyframes through the studio. The home page scrolls through
 * `homePath` (hero → services → portfolio → about → contact); other routes
 * park the camera at their own viewpoint, so every page opens on a different
 * part of the same world and route changes become camera moves.
 */
export interface Shot {
  pos: [number, number, number]
  target: [number, number, number]
  /** Fog density — lower is clearer/brighter. */
  fog: number
  /** 0 = warm dark studio, 1 = clean bright finale. */
  bright: number
}

export const homePath: Shot[] = [
  // 0 hero — wide, raised view across the working studio
  { pos: [5.5, 2.6, 11], target: [-0.5, 1.5, -3], fog: 0.045, bright: 0 },
  // 1 services — dolly in toward the floating holographic displays
  { pos: [1.2, 2.1, 3.6], target: [-0.4, 2.2, -4.5], fog: 0.05, bright: 0.05 },
  // 2 portfolio — pan to the gallery wall of large screens
  { pos: [-2.5, 2.3, -0.5], target: [-9, 2.2, -6], fog: 0.05, bright: 0.1 },
  // 3 about — the team zone, low and warm
  { pos: [3.8, 1.7, -5.5], target: [6, 1.2, -11], fog: 0.05, bright: 0.2 },
  // 4 contact — rise toward the glass wall and city light
  { pos: [0, 2.3, -8.5], target: [0, 2.6, -30], fog: 0.028, bright: 1 },
]

export const presetShots: Record<Exclude<ScenePreset, 'home'>, Shot> = {
  about: { pos: [4.5, 1.9, -3.5], target: [6, 1.2, -11], fog: 0.048, bright: 0.2 },
  services: { pos: [0.8, 2.3, 4.2], target: [-0.4, 2.2, -4.5], fog: 0.05, bright: 0.05 },
  portfolio: { pos: [-1.8, 2.4, 0.5], target: [-9, 2.2, -6], fog: 0.05, bright: 0.1 },
  project: { pos: [-4.5, 2.2, -2.2], target: [-9.5, 2.2, -6], fog: 0.055, bright: 0.1 },
  industries: { pos: [0, 4.1, 9.5], target: [0, 0.4, -6], fog: 0.04, bright: 0.25 },
  careers: { pos: [-3.5, 1.6, 2.5], target: [0.5, 1.1, -6], fog: 0.05, bright: 0.15 },
  contact: { pos: [0, 2.3, -8.5], target: [0, 2.6, -30], fog: 0.028, bright: 1 },
}
