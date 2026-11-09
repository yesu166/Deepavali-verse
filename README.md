# Deepavali Verse

A cinematic, interactive Deepavali world built with React, TypeScript, CSS, SVG and Canvas. Explore a palace courtyard, light lamps, make rangoli, launch fireworks and share a personal greeting.

## Experiences

- **Grand Courtyard** — custom illustrated palace environment, subtle pointer parallax, atmospheric particles and six discoverable scene portals.
- **Diya Courtyard** — light 14 individual lamps; progress persists in the browser.
- **Rangoli Atelier** — interactive SVG petals, three design geometries, colour palettes, undo/reset and PNG export.
- **Fireworks Terrace** — Canvas 2D rockets, staggered multi-shot salvos, placeable batteries, and distinct anar, chakri, phooljhadi and ladi cracker effects. Bloom/willow/comet shell styles and colour selection included.
- **Festival soundscape** — original Web Audio ambience with a tanpura/bansuri-inspired drone, soft bell accents, rocket whistles, aerial booms, anar fizz, chakri spin, phooljhadi sparkle and ladi crackle. Sound is opt-in and mixable with master/ambience sliders plus individual SFX previews.
- **Sweet Bazaar** — dedicated illustrated market environment and a timed Laddu Catcher game with a local best score.
- **Lantern Ghat** — write and release a wish; wishes are saved locally.
- **Greeting Pavilion** — personalised greeting cards, PNG download and WhatsApp sharing.

## Interactive cracker terrace

- Three.js 3D stage with a selected-product preview, floor placement, parallax camera response, and click-to-ignite placed models.
- 12 custom procedural cracker models: Rocket, Flower Pot, Anar, Chakri, Phooljhadi/Sparkler, Ladi, Bijili, Atom Bomb, Sutli Bomb, Snake Tablet, 1000 Wala and Multi-shot Battery.
- Each model uses individually generated geometry, ornamental foil textures, metallic trim, and a corresponding particle/sound burst. The models are original visual representations, not downloadable product photographs or manufacturer CAD files.
- 3D rendering is lazy-loaded and disabled on the mobile landing page to preserve phone performance.

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