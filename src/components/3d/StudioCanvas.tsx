import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Instance, Instances, Lightformer, MeshReflectorMaterial, PerformanceMonitor, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { sceneStore } from '../../lib/sceneStore'
import { device } from '../../lib/device'
import { homePath, presetShots, type Shot } from './cameraPath'
import { projects } from '../../data/site'
import { glowSprite, rand, screenTexture, skyTexture, type ScreenVariant } from './screenTextures'

/**
 * The persistent WebGL studio behind every page: a dark creative-tech office
 * with reflective floor, warm linear ceiling light, desks of glowing
 * monitors, brand signage, a glass curtain wall over a night city, and
 * floating holographic displays. The camera travels through it by scroll
 * (home) or by route (other pages). Loaded lazily; see SceneBackground.
 */

const tier = device.tier
const DARK = new THREE.Color('#05070b')
const BRIGHT = new THREE.Color('#1b2230')

export default function StudioCanvas() {
  const [dpr, setDpr] = useState(tier === 'high' ? 1.5 : tier === 'mid' ? 1.25 : 1)

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: tier !== 'low', powerPreference: 'high-performance', alpha: false, stencil: false }}
      camera={{ fov: 42, near: 0.1, far: 90, position: homePath[0].pos }}
      frameloop={device.reducedMotion ? 'demand' : 'always'}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        scene.background = DARK.clone()
        scene.fog = new THREE.FogExp2(DARK.clone(), 0.045)
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <CameraRig />
      <Lighting />
      <Floor />
      <Ceiling />
      <Desks />
      <Signage />
      <GalleryWall />
      <TeamZone />
      <GlassWall />
      <HoloPanels />
      <Dust count={tier === 'low' ? 120 : 320} />
    </Canvas>
  )
}

/* -------------------------------------------------------------------------- */

const tmpPos = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()
const lerpShot = (a: Shot, b: Shot, t: number, outPos: THREE.Vector3, outTarget: THREE.Vector3) => {
  outPos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t),
  )
  outTarget.set(
    THREE.MathUtils.lerp(a.target[0], b.target[0], t),
    THREE.MathUtils.lerp(a.target[1], b.target[1], t),
    THREE.MathUtils.lerp(a.target[2], b.target[2], t),
  )
  return {
    fog: THREE.MathUtils.lerp(a.fog, b.fog, t),
    bright: THREE.MathUtils.lerp(a.bright, b.bright, t),
  }
}

function CameraRig() {
  const invalidate = useThree((s) => s.invalidate)
  const look = useRef(new THREE.Vector3(...homePath[0].target))
  const px = useRef(0)
  const py = useRef(0)
  const state = useRef({ fog: homePath[0].fog, bright: 0, first: true })

  useFrame(({ camera, scene }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    let fog: number
    let bright: number

    if (sceneStore.preset === 'home') {
      const s = THREE.MathUtils.clamp(sceneStore.stage, 0, homePath.length - 1)
      const i = Math.min(Math.floor(s), homePath.length - 2)
      const t = THREE.MathUtils.smootherstep(s - i, 0, 1)
      ;({ fog, bright } = lerpShot(homePath[i], homePath[i + 1], t, tmpPos, tmpTarget))
    } else {
      const shot = presetShots[sceneStore.preset]
      ;({ fog, bright } = lerpShot(shot, shot, 0, tmpPos, tmpTarget))
      // gentle dolly as the page scrolls
      const p = sceneStore.progress
      tmpPos.z -= p * 1.6
      tmpPos.y += p * 0.4
    }

    const still = device.reducedMotion
    if (!still) {
      px.current = THREE.MathUtils.damp(px.current, sceneStore.pointer.x, 2.5, dt)
      py.current = THREE.MathUtils.damp(py.current, sceneStore.pointer.y, 2.5, dt)
      tmpPos.x += px.current * 0.45
      tmpPos.y -= py.current * 0.22
      tmpTarget.x += px.current * 0.25
    }

    const k = still || state.current.first ? 1 : 1 - Math.exp(-dt * 2.4)
    state.current.first = false
    camera.position.lerp(tmpPos, k)
    look.current.lerp(tmpTarget, k)
    camera.lookAt(look.current)

    const st = state.current
    st.fog += (fog - st.fog) * k
    st.bright += (bright - st.bright) * k
    const f = scene.fog as THREE.FogExp2
    f.density = st.fog
    f.color.copy(DARK).lerp(BRIGHT, st.bright)
    ;(scene.background as THREE.Color).copy(f.color)
  })

  // Reduced motion renders on demand: request a frame only when the page or
  // scroll stage changes (the rig then snaps straight to the new shot).
  useEffect(() => {
    if (!device.reducedMotion) return
    let last = ''
    const id = setInterval(() => {
      const key = `${sceneStore.preset}:${sceneStore.stage.toFixed(2)}:${sceneStore.progress.toFixed(2)}`
      if (key !== last) {
        last = key
        invalidate()
      }
    }, 200)
    return () => clearInterval(id)
  }, [invalidate])

  return null
}

/* -------------------------------------------------------------------------- */

function Lighting() {
  const warm = '#ff9a4d'
  return (
    <>
      <ambientLight intensity={0.18} color="#8fa4ff" />
      <hemisphereLight args={['#2a3350', '#050608', 0.35]} />
      {[
        [-3, 4.2, 4],
        [4, 4.2, 1],
        [-2, 4.2, -5],
        [5.5, 3.2, -11],
        [-8, 4, -6],
      ].map((p, i) => (
        <pointLight key={i} position={p as [number, number, number]} color={warm} intensity={18} distance={14} decay={2} />
      ))}
      <pointLight position={[0, 3, -16]} color="#6aa8ff" intensity={10} distance={16} decay={2} />
      <Environment frames={1} resolution={tier === 'low' ? 32 : 128} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={3} color={warm} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[14, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#9fb6ff" position={[0, 2, -12]} scale={[20, 4, 1]} />
        <Lightformer form="ring" intensity={2} color={warm} position={[-6, 3, 4]} scale={2} />
      </Environment>
    </>
  )
}

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 12]}>
      <planeGeometry args={[90, 60]} />
      {tier === 'low' ? (
        <meshStandardMaterial color="#0b0d12" roughness={0.35} metalness={0.6} />
      ) : (
        <MeshReflectorMaterial
          blur={[300, 90]}
          resolution={tier === 'high' ? 1024 : 512}
          mixBlur={1}
          mixStrength={38}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0c11"
          metalness={0.55}
          mirror={0}
        />
      )}
    </mesh>
  )
}

function Ceiling() {
  const strips = useMemo(() => {
    const out: [number, number, number][] = []
    for (let z = 10; z >= -17; z -= 3.2) for (const x of [-7, -1.5, 4]) out.push([x, 4.55, z])
    return out
  }, [])
  return (
    <group>
      <mesh rotation-x={Math.PI / 2} position={[0, 4.62, 4]}>
        <planeGeometry args={[40, 44]} />
        <meshStandardMaterial color="#07080c" roughness={0.9} />
      </mesh>
      <Instances limit={strips.length}>
        <boxGeometry args={[3.4, 0.03, 0.07]} />
        <meshBasicMaterial color={new THREE.Color('#ffb070').multiplyScalar(1.1)} toneMapped={false} />
        {strips.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
      {/* pillars with vertical light blades */}
      {[
        [-9.5, 2],
        [9.5, 2],
        [-9.5, -9],
        [9.5, -9],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 2.3, z]}>
          <mesh>
            <boxGeometry args={[0.7, 4.6, 0.7]} />
            <meshStandardMaterial color="#0e1016" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[x < 0 ? 0.36 : -0.36, 0, 0]}>
            <boxGeometry args={[0.02, 4.2, 0.06]} />
            <meshBasicMaterial color={new THREE.Color('#ff8a3a').multiplyScalar(1.8)} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const deskVariants: ScreenVariant[] = ['code', 'dashboard', 'timeline', 'design']

function Desks() {
  const layout = useMemo(() => {
    const desks: [number, number, number][] = []
    const screens: Record<ScreenVariant, [number, number, number][]> = { code: [], dashboard: [], timeline: [], design: [], mobile: [] }
    let n = 0
    const rows = tier === 'low' ? [3, -1.5] : [5, 1.5, -2, -6.5]
    for (const z of rows) {
      for (const x of [-6, -3, 0, 3, 6]) {
        if (z < -5 && x > 2) continue // leave room for the team zone
        desks.push([x, 0.74, z])
        for (const off of [-0.36, 0.36]) {
          screens[deskVariants[n++ % deskVariants.length]].push([x + off, 1.12, z - 0.25])
        }
      }
    }
    return { desks, screens }
  }, [])

  return (
    <group>
      {/* desk tops */}
      <Instances limit={layout.desks.length}>
        <boxGeometry args={[1.7, 0.05, 0.85]} />
        <meshStandardMaterial color="#1b1e26" roughness={0.35} metalness={0.4} />
        {layout.desks.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
      {/* desk bases */}
      <Instances limit={layout.desks.length}>
        <boxGeometry args={[1.5, 0.72, 0.05]} />
        <meshStandardMaterial color="#0c0e13" roughness={0.8} />
        {layout.desks.map(([x, , z], i) => (
          <Instance key={i} position={[x, 0.36, z - 0.3]} />
        ))}
      </Instances>
      {/* chairs */}
      <Instances limit={layout.desks.length * 2}>
        <boxGeometry args={[0.5, 0.75, 0.08]} />
        <meshStandardMaterial color="#12141a" roughness={0.7} />
        {layout.desks.flatMap(([x, , z], i) => [
          <Instance key={`a${i}`} position={[x - 0.4, 0.85, z + 0.75]} />,
          <Instance key={`b${i}`} position={[x + 0.4, 0.85, z + 0.75]} />,
        ])}
      </Instances>
      {/* monitor frames */}
      <Instances limit={layout.desks.length * 2}>
        <boxGeometry args={[0.66, 0.41, 0.03]} />
        <meshStandardMaterial color="#20242e" roughness={0.25} metalness={0.85} />
        {Object.values(layout.screens)
          .flat()
          .map((p, i) => (
            <Instance key={i} position={[p[0], p[1], p[2] - 0.02]} />
          ))}
      </Instances>
      {/* screens — one instanced mesh per texture */}
      {deskVariants.map((v, vi) => (
        <Instances key={v} limit={layout.screens[v].length || 1}>
          <planeGeometry args={[0.62, 0.37]} />
          <meshBasicMaterial map={screenTexture(v, 256, 160, 11 + vi)} toneMapped={false} />
          {layout.screens[v].map((p, i) => (
            <Instance key={i} position={p} />
          ))}
        </Instances>
      ))}
    </group>
  )
}

function Signage() {
  return (
    <group position={[-4.5, 0, -10.5]}>
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[5.5, 3.8, 0.2]} />
        <meshStandardMaterial color="#0d0f15" roughness={0.45} metalness={0.4} />
      </mesh>
      {/* the logo loads as a texture; the wall stands alone until it arrives */}
      <Suspense fallback={null}>
        <LogoSign />
      </Suspense>
    </group>
  )
}

/** Backlit brand sign: the official logo on the wall with a soft warm halo. */
function LogoSign() {
  const tex = useTexture('/brand/oqh-logo-on-dark.png')
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const w = 3.4
  const h = w * (407 / 570)
  return (
    <group position={[0, 2, 0.12]}>
      <mesh position={[0, 0, -0.01]} scale={[w * 1.5, h * 1.4, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={glowSprite()} color="#ff7a1a" transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} color={new THREE.Color(0.75, 0.75, 0.75)} />
      </mesh>
    </group>
  )
}

const galleryShots = projects.slice(0, 3).map((p) => p.images.desktop)

function GalleryWall() {
  const items: { v: ScreenVariant; z: number; y: number }[] = [
    { v: 'design', z: -2.5, y: 2.3 },
    { v: 'dashboard', z: -6, y: 2.4 },
    { v: 'timeline', z: -9.5, y: 2.3 },
  ]
  return (
    <group position={[-10.2, 0, 0]} rotation-y={Math.PI / 2}>
      <mesh position={[6, 2.3, -0.15]}>
        <planeGeometry args={[16, 4.6]} />
        <meshStandardMaterial color="#0b0d12" roughness={0.6} />
      </mesh>
      {items.map((it, i) => (
        <group key={i} position={[-it.z, it.y, 0]}>
          <mesh position={[0, 0, -0.03]}>
            <boxGeometry args={[3.1, 1.9, 0.05]} />
            <meshStandardMaterial color="#1c2029" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* procedural screen until the real project screenshot has loaded */}
          <Suspense
            fallback={
              <mesh>
                <planeGeometry args={[3, 1.8]} />
                <meshBasicMaterial map={screenTexture(it.v, 512, 320, 21 + i)} toneMapped={false} />
              </mesh>
            }
          >
            <ShotScreen url={galleryShots[i]} />
          </Suspense>
        </group>
      ))}
    </group>
  )
}

/** A wall display showing a real client-site screenshot. */
function ShotScreen({ url }: { url: string }) {
  const tex = useTexture(url)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return (
    <mesh>
      <planeGeometry args={[3, 1.8]} />
      <meshBasicMaterial map={tex} toneMapped={false} color={new THREE.Color(0.85, 0.85, 0.85)} />
    </mesh>
  )
}

function TeamZone() {
  return (
    <group position={[6, 0, -11.5]}>
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[4.2, 0.06, 1.4]} />
        <meshStandardMaterial color="#2a211a" roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[3.6, 0.76, 0.3]} />
        <meshStandardMaterial color="#0c0e13" roughness={0.8} />
      </mesh>
      {/* linear suspended light over the table */}
      <group position={[0, 2.35, 0]}>
        {[-1.6, 1.6].map((x) => (
          <mesh key={x} position={[x, 1.1, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 2.2, 4]} />
            <meshBasicMaterial color="#2a2d35" />
          </mesh>
        ))}
        <mesh>
          <boxGeometry args={[3.6, 0.05, 0.12]} />
          <meshStandardMaterial color="#15171d" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.028, 0]}>
          <boxGeometry args={[3.5, 0.01, 0.08]} />
          <meshBasicMaterial color={new THREE.Color('#ffc88a').multiplyScalar(1.8)} toneMapped={false} />
        </mesh>
      </group>
      {/* team wall display */}
      <group position={[0, 2.1, -2.6]}>
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[4.1, 2.3, 0.06]} />
          <meshStandardMaterial color="#1c2029" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh>
          <planeGeometry args={[4, 2.2]} />
          <meshBasicMaterial map={screenTexture('mobile', 512, 280, 31)} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function GlassWall() {
  const bokeh = useMemo(() => {
    const n = tier === 'low' ? 160 : 420
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const warm = new THREE.Color('#ffae5c')
    const cool = new THREE.Color('#8fb4ff')
    const white = new THREE.Color('#fff4e6')
    const random = rand(1337)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (random() - 0.5) * 70
      pos[i * 3 + 1] = -8 + random() * 14
      pos[i * 3 + 2] = -30 - random() * 40
      const c = random() < 0.55 ? warm : random() < 0.6 ? white : cool
      col.set([c.r, c.g, c.b], i * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [])

  const mullions = useMemo(() => {
    const out: number[] = []
    for (let x = -14; x <= 14; x += 2.4) out.push(x)
    return out
  }, [])

  return (
    <group>
      <points geometry={bokeh}>
        <pointsMaterial
          size={1.1}
          map={glowSprite()}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.85}
          fog={false}
          sizeAttenuation
        />
      </points>
      {/* night sky with a warm horizon glow — the view the contact page rises toward */}
      <mesh position={[0, 4, -80]}>
        <planeGeometry args={[220, 70]} />
        <meshBasicMaterial map={skyTexture()} fog={false} toneMapped={false} depthWrite={false} />
      </mesh>
      {/* glass pane: barely there, just enough to catch a reflection */}
      <mesh position={[0, 2.3, -18]}>
        <planeGeometry args={[34, 4.6]} />
        <meshStandardMaterial color="#1a2436" transparent opacity={0.05} roughness={0.05} metalness={0.9} depthWrite={false} />
      </mesh>
      {/* head and sill frame the opening */}
      {[0.06, 4.56].map((y) => (
        <mesh key={y} position={[0, y, -18]}>
          <boxGeometry args={[34, 0.12, 0.3]} />
          <meshStandardMaterial color="#10131a" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}
      <Instances limit={mullions.length}>
        <boxGeometry args={[0.07, 4.6, 0.12]} />
        <meshStandardMaterial color="#12151c" roughness={0.4} metalness={0.8} />
        {mullions.map((x) => (
          <Instance key={x} position={[x, 2.3, -18]} />
        ))}
      </Instances>
    </group>
  )
}

const holoLayout: { v: ScreenVariant; p: [number, number, number]; r: number; s: number }[] = [
  { v: 'code', p: [-2.3, 2.3, -4.2], r: 0.45, s: 1 },
  { v: 'mobile', p: [-0.7, 2.75, -5.2], r: 0.15, s: 0.9 },
  { v: 'dashboard', p: [1, 2.5, -4.6], r: -0.2, s: 1 },
  { v: 'design', p: [2.4, 1.95, -3.6], r: -0.5, s: 0.85 },
  { v: 'timeline', p: [0.1, 1.75, -3.4], r: 0, s: 0.9 },
]

function HoloPanels() {
  const group = useRef<THREE.Group>(null)
  const edge = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.4, 0.88)), [])
  useFrame(({ clock }) => {
    if (!group.current || device.reducedMotion) return
    const t = clock.elapsedTime
    group.current.children.forEach((c, i) => {
      c.position.y = holoLayout[i].p[1] + Math.sin(t * 0.6 + i * 1.3) * 0.06
      c.rotation.y = holoLayout[i].r + Math.sin(t * 0.3 + i) * 0.03
    })
  })
  return (
    <group ref={group}>
      {holoLayout.map((h, i) => (
        <group key={i} position={h.p} rotation-y={h.r} scale={h.s}>
          <mesh>
            <planeGeometry args={[1.4, 0.88]} />
            <meshBasicMaterial
              map={screenTexture(h.v, 512, 320, 41 + i)}
              transparent
              opacity={0.88}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineSegments geometry={edge}>
            <lineBasicMaterial color={new THREE.Color('#ffa04d').multiplyScalar(1.6)} toneMapped={false} transparent opacity={0.8} />
          </lineSegments>
          {/* soft glow card behind the glass */}
          <mesh position={[0, 0, -0.02]} scale={[1.25, 1.35, 1]}>
            <planeGeometry args={[1.4, 0.88]} />
            <meshBasicMaterial map={glowSprite()} color="#ff7a1a" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const random = rand(42)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (random() - 0.5) * 24
      pos[i * 3 + 1] = random() * 4.4
      pos[i * 3 + 2] = 8 - random() * 26
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])
  useFrame(({ clock }) => {
    if (ref.current && !device.reducedMotion) {
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.03) * 0.08
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.08
    }
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.05}
        map={glowSprite()}
        color="#ffcf9a"
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
