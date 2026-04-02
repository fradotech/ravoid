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
A premium cinematic 3D illustration for a SaaS / tech blog about "<TOPIC>".

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
- subtle UI-like micro text allowed (optional)

Landscape 1200x630. No text, no logos, no people.
```

#### Compress Command

```bash
cwebp -q 80 -resize 1200 630 input.webp -o public/images/posts/[slug].webp
```

#### Content Markdown

```
You are writing for Ravoid (ravoid.com), a premium engineering blog focused on SaaS infrastructure, AI cost analysis, and technical decision-making. The audience is engineering leaders, technical founders, and senior developers who build and operate production systems. Every article should feel like advice from someone who has personally made expensive mistakes and is sharing the lesson.

The article should make the reader slightly uncomfortable about their current approach.

---

Tone & Style:

- Insight-driven, not tutorial
- Write like you are calling out a mistake, not explaining a concept.
- Assume the reader is smart but wrong.
- Slightly opinionated, with clear point of view
- If the writing feels safe or neutral, rewrite it to be sharper and more opinionated.
- Do not try to be balanced. Prioritize clarity over fairness.
- Feels like a premium engineering blog (not marketing, not academic)

---

WRITING RULES:

- Target long-form depth (approx 3000–5000 words equivalent)
- Each paragraph: 3–5 sentences (max 6)
- Avoid 1–2 sentence paragraphs except for emphasis
- Avoid overly long dense paragraphs
- Avoid excessive line breaks and fragmentation
- Include 3-5 internal links to existing articles on ravoid.com/blog/
- Maintain balance:

  - ~65–80% narrative paragraphs
  - ~20–35% structured content (lists, tables)

- Include:

  - multiple realistic scenarios
  - concrete numbers (rough estimates are fine)
  - at least 2–4 meaningful tables
  - 1–2 concise bullet sections (3–5 items each)

- Do NOT use em dash (—)

---

Follow this structure:

1. Hook (pattern break)

- 1–2 sharp sentences
- create tension or contradiction

---

2. Context

- describe common belief or situation
- grounded and relatable

---

3. False assumption

- clearly explain the incorrect mental model
- make it feel subtle but important

---

4. Concrete example (early)

- include a realistic scenario
- use rough numbers
- make the problem tangible

---

5. Where the model breaks

- short intro paragraph
- followed by 3–5 bullet points
- each point reflects real system behavior

---

6. Deep scenario expansion (NEW – REQUIRED)

- add 2–3 scenarios:

  - early stage
  - growth stage
  - scale stage
- show how behavior and cost change
- include numbers where possible

---

7. Hidden cost / system leak section

- explain where cost actually accumulates
- include a table breaking down components
- highlight what teams usually miss

---

8. Anchor insight section (deepest part)

- create a strong section title
- this must be the longest and most insightful section
- explain the core mechanism clearly
- include one conceptual table (pattern → insight)

---

9. Framework / mental model

- introduce a formula or model
- explain each variable clearly
- include a small table for interpretation

---

10. Trade-off section

- include a detailed comparison table
- include columns:

  - decision
  - what you gain
  - what you pay
  - when it breaks

---

11. Decision guidance (IMPORTANT)

- explain when each approach makes sense
- based on stage, scale, and constraints
- avoid generic advice

---

12. Common mistake section (SHORT)

- highlight 1–2 key mistakes
- make it slightly uncomfortable or direct

---

13. Closing (strong, reflective)

- Use a distinctive section title. Rotate between styles:
  - "The Real Question"
  - "What Actually Matters"
  - "What This Means in Practice"
  - "The Part Nobody Wants to Hear"
  - or a topic-specific title that reframes the core insight
- Do NOT reuse the same closing title across multiple articles
- Reframe the topic from a higher level
- End with 1-2 strong, quotable lines
- Vary the closing structure: sometimes end with a question, sometimes a contradiction, sometimes a callback to the opening hook

- reframe the topic

- end with 1–2 strong, quotable lines

---

Additional style elements:

- Include 2–4 short quote-style lines for emphasis
- Add 1–2 contradiction insights
- Use subtle transitions between sections
- Keep flow natural, not mechanical

---

Topic:
[INSERT TOPIC]

---

Output:

Return the full article in clean markdown format, ready to publish.
```

## Ref

- techcrunch.com
- theverge.com
