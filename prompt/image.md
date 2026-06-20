## Hero Image AI Prompt

```
A premium cinematic 3D illustration for a SaaS / tech blog.

Style:

- dark moody atmosphere with selective colorful accents
- photorealistic 3D render, ultra-detailed
- glassmorphism / translucent holographic materials
- soft reflections, refractions, subtle dispersion
- cinematic volumetric lighting, moody atmosphere
- shallow depth of field, background bokeh
- semi-abstract editorial (not literal, not flat, not vector)

Art direction:

- minimal, clean, high-end tech aesthetic
- soft neon accents (blue, purple, teal, subtle contrasting highlights)

Text:

- no large central title
- add subtle UI-like micro text

---
TOPIC:

---
Landscape 1200x630. No text, no logos, no people.
```

## Compress Command

```bash
cwebp -q 100 -resize 1200 630 img.png -o public/images/posts/[slug].webp
```

## Automated generation (recommended)

Generate + crop + compress in one command. Set ONE API key first:

```bash
export REPLICATE_API_TOKEN=...   # recommended: Flux 1.1 Pro, cinematic
# or
export OPENAI_API_KEY=...        # gpt-image-1
```

Then run (reads this file's prompt block, injects the topic, writes the webp):

```bash
pnpm gen:hero <slug> "<one-line topic for the hero>"
# example:
pnpm gen:hero per-seat-pricing-is-dead "Glowing translucent glass seat panels dissolving left to right, dark fintech mood, indigo/purple/teal accents"
```

Output lands at `public/images/posts/<slug>.webp` at exactly 1200x630.
Script: `scripts/generate-hero.mjs`.
