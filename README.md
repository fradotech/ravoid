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
A premium cinematic 3D illustration for a blog article about "[TOPIC]".
The scene shows a dark polished surface with [MAIN VISUAL ELEMENTS - describe 2-3 key objects/metaphors relevant to the topic].
Each element has distinct color-coded glowing accents to differentiate concepts.
Thin luminous connection lines link the elements.
Background: deep dark navy-charcoal gradient with soft bokeh orbs in teal and amber.
Style: photorealistic 3D render, cinematic volumetric lighting, shallow depth of field.
Premium SaaS editorial aesthetic. Landscape 1200x630. No text, no logos, no people.
```

#### Compress Command

```bash
cwebp -q 80 -resize 1200 630 input.webp -o public/images/posts/[slug].webp
```

## Ref
- techcrunch.com
- theverge.com