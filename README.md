# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## AI Prompt

#### Hero Image AI Prompt

```
A premium cinematic 3D illustration for a SaaS / tech blog about **"[TOPIC]"**.

Style:

* photorealistic 3D render, ultra-detailed
* glassmorphism / translucent holographic materials
* soft reflections, refractions, subtle dispersion
* cinematic volumetric lighting, moody atmosphere
* shallow depth of field, background bokeh
* semi-abstract editorial (not literal, not flat, not vector)

Art direction:

* minimal, clean, high-end tech aesthetic
* soft neon accents (blue, purple, teal, subtle contrasting highlights)
* strong sense of depth, layering, and spatial composition
* elegant glow, light scattering, and atmospheric particles

Composition:

* balanced, modern layout with natural spacing
* visually striking focal point, no clutter

Text:

* no large central title
* subtle UI-like micro text allowed (optional)

Rendering quality:

* ray-traced lighting, global illumination
* high dynamic range, crisp details, premium finish

Landscape 1200x630. No text, no logos, no people.
```

#### Compress Command

```bash
cwebp -q 80 -resize 1200 630 input.webp -o public/images/posts/[slug].webp
```

#### Content Markdown

```
Write a long-form, expert-level SaaS engineering blog article.

This article must feel like it is written by an experienced engineer or founder who has seen real production systems, not by an AI or a beginner.

---

Tone & Style:

* Insight-driven, not tutorial
* Slightly opinionated, with clear point of view
* Natural, human, non-AI tone
* Avoid generic phrasing and overly polished transitions
* Feels like a premium engineering blog (not marketing, not academic)

---

CRITICAL WRITING RULES:

* Target long-form depth (approx 2000–3000 words equivalent)

* Each paragraph: 3–5 sentences (max 6)

* Avoid 1–2 sentence paragraphs except for emphasis

* Avoid overly long dense paragraphs

* Avoid excessive line breaks and fragmentation

* Do NOT write like a Twitter thread

* Maintain balance:

  * ~65–75% narrative paragraphs
  * ~25–35% structured content (lists, tables)

* Include:

  * multiple realistic scenarios
  * concrete numbers (rough estimates are fine)
  * at least 2–4 meaningful tables
  * 1–2 concise bullet sections (3–5 items each)

* Avoid:

  * filler content
  * repeating the same idea in different words
  * generic “best practices”

* Do NOT use em dash (—)

---

Topic:
[INSERT TOPIC]

---

Follow this structure:

1. Hook (pattern break)

* 1–2 sharp sentences
* create tension or contradiction

---

2. Context

* describe common belief or situation
* grounded and relatable

---

3. False assumption

* clearly explain the incorrect mental model
* make it feel subtle but important

---

4. Concrete example (early)

* include a realistic scenario
* use rough numbers
* make the problem tangible

---

5. Where the model breaks

* short intro paragraph
* followed by 3–5 bullet points
* each point reflects real system behavior

---

6. Deep scenario expansion (NEW – REQUIRED)

* add 2–3 scenarios:

  * early stage
  * growth stage
  * scale stage
* show how behavior and cost change
* include numbers where possible

---

7. Hidden cost / system leak section

* explain where cost actually accumulates
* include a table breaking down components
* highlight what teams usually miss

---

8. Anchor insight section (deepest part)

* create a strong section title
* this must be the longest and most insightful section
* explain the core mechanism clearly
* include one conceptual table (pattern → insight)

---

9. Framework / mental model

* introduce a formula or model
* explain each variable clearly
* include a small table for interpretation

---

10. Trade-off section

* include a detailed comparison table
* include columns:

  * decision
  * what you gain
  * what you pay
  * when it breaks

---

11. Decision guidance (IMPORTANT)

* explain when each approach makes sense
* based on stage, scale, and constraints
* avoid generic advice

---

12. Common mistake section (SHORT)

* highlight 1–2 key mistakes
* make it slightly uncomfortable or direct

---

13. Closing (strong, reflective)

* use a title like:

  * "The Real Question"
  * "What Actually Matters"

* reframe the topic

* end with 1–2 strong, quotable lines

---

Additional style elements:

* Include 2–4 short quote-style lines for emphasis
* Add 1–2 contradiction insights
* Use subtle transitions between sections
* Keep flow natural, not mechanical

---

Output:

Return the full article in clean markdown format, ready to publish.
```

## Ref

- techcrunch.com
- theverge.com
