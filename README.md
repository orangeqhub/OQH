# Orange Quantum Hub — website

Cinematic, interactive 3D website for **Orange Quantum Hub Private Limited**.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
npm run lint
```

Deploying as a static site: configure the host to serve `index.html` for all
routes (SPA fallback), since routing is client-side (`/about`, `/portfolio/:slug`, …).

## Configuration

Copy `.env.example` to `.env`. The contact and careers forms deliver via
`VITE_CONTACT_ENDPOINT` (JSON POST) or, failing that, open the visitor's mail
client addressed to `VITE_CONTACT_EMAIL`. With neither set, the form shows an
honest "not available" message — it never fakes a successful send.

## Content

All copy lives in `src/data/site.ts`. It deliberately contains **no**
statistics, client names, testimonials, addresses or phone numbers — add real
ones there. Portfolio entries are marked `kind: 'concept'` (shown with a
"Concept" badge) until replaced by approved case studies.

The logo in `src/components/ui/Logo.tsx` is a neutral placeholder mark; swap in
the official asset when available.

## Architecture

| Area | Where | Notes |
| --- | --- | --- |
| Design tokens | `src/styles/tokens.css`, `src/lib/tokens.ts` | Colours, type scale (clamp), spacing, radii, shadows, glass, easings |
| WebGL studio | `src/components/3d/StudioCanvas.tsx` | three.js via React Three Fiber + drei; lazy-loaded after first paint |
| Camera path | `src/components/3d/cameraPath.ts` | Home scrolls hero → services → portfolio → about → contact; each route has its own viewpoint |
| Floating UI | `src/components/3d/FloatingPanel.tsx`, `FloatingDevice.tsx`, `panels/` | DOM glass displays + CSS-3D laptop/phone; interface mocks scale via container queries |
| Motion | `src/components/animations/`, `src/hooks/` | GSAP + ScrollTrigger reveals (rise / depth / clip / lines / scale), Lenis smooth scroll, magnetic buttons, 3D tilt, pointer parallax, page-transition curtain |
| Shared scene state | `src/lib/sceneStore.ts` | Pointer / scroll stage written by the DOM, read in the render loop (no React re-renders) |

### Performance & accessibility

- three.js chunk (~270 kB gzip) loads on idle; a painted CSS studio shows until then and permanently if WebGL is unavailable or fails.
- GPU tier detection lowers DPR, drops floor reflections and halves instance/particle counts on low-end and small devices; `PerformanceMonitor` lowers DPR further if FPS drops.
- `prefers-reduced-motion`: no smooth scroll, no custom cursor, no parallax/tilt, reveals disabled, 3D renders on demand with a static camera.
- Custom cursor only on fine pointers; touch devices keep native behaviour.
- Skip link, semantic landmarks, focus-visible styles, accessible menu dialog (Escape + focus return), labelled form fields with inline errors.
