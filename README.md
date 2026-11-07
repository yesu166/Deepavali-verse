# Deepavali Verse

A cinematic, interactive Deepavali world built with React, TypeScript, CSS, SVG and Canvas. Explore a palace courtyard, light lamps, make rangoli, launch fireworks and share a personal greeting.

## Experiences

- **Grand Courtyard** — custom illustrated palace environment, subtle pointer parallax, atmospheric particles and six discoverable scene portals.
- **Diya Courtyard** — light 14 individual lamps; progress persists in the browser.
- **Rangoli Atelier** — interactive SVG petals, three design geometries, colour palettes, undo/reset and PNG export.
- **Fireworks Terrace** — Canvas 2D rockets and particle bursts, selectable colours and bloom/willow/comet patterns.
- **Sweet Bazaar** — dedicated illustrated market environment and a timed Laddu Catcher game with a local best score.
- **Lantern Ghat** — write and release a wish; wishes are saved locally.
- **Greeting Pavilion** — personalised greeting cards, PNG download and WhatsApp sharing.

## Stack

React 18 · TypeScript · Vite · Framer Motion · Zustand · Lucide · html-to-image

## Local development

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Notes

- No backend is required for the current version. Personal progress, wishes and best scores use browser storage.
- Illustrated environment artwork is served from the configured media CDN; all text, controls and hotspots remain native, accessible UI.
- GitHub Actions runs the TypeScript check and production build on pushes and pull requests to `main`.
- Vercel SPA rewrites are included in `vercel.json`.