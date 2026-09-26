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

## Contact & WhatsApp

The business number lives in `src/data/site.ts` (`contact.phone` for display,
`contact.phoneDigits` = country code + number for links).

- **Contact / Careers forms** validate, then open WhatsApp (`wa.me`) with every
  filled field pre-typed; the visitor taps *Send* in WhatsApp.
- **Let's Talk** (header) opens WhatsApp with a pre-filled greeting (`whatsappGreeting`).
- **Floating buttons** on every page: WhatsApp chat and a `tel:` call link.

Optional `.env` values (`VITE_CONTACT_EMAIL`, `VITE_CONTACT_ADDRESS`) add an
email/address line to the Contact page and footer.

## Deploying

Client-side routing needs every path served by `index.html`. Included:
`public/.htaccess` (Apache / Hostinger / cPanel), `public/_redirects`
(Netlify) and `vercel.json` (Vercel).

## Content

All copy lives in `src/data/site.ts`: services, industries, values, careers and
the 8 client projects (screenshots in `public/projects/`, captured from the live
sites). Service photos in `public/services/` are free-licence Unsplash images —
sources in `public/services/CREDITS.md`. The official logo files are in
`public/brand/` (`*-on-dark` variants lift the navy text for the dark theme).

`venkateshinteriors.online` had an expired SSL certificate when captured, so its
"Visit live site" link is off (`liveLink: false`) until the certificate is renewed.

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
