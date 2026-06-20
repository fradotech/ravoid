#!/usr/bin/env node
// Generate a 1200x630 hero image for a Ravoid post and compress to webp.
//
// Usage:
//   node scripts/generate-hero.mjs <slug> "<topic sentence>"
//   pnpm gen:hero <slug> "<topic sentence>"
//
// Provider: Pollinations (free, no API key, Flux-backed) by default.
// Optional: set IMAGE_PROVIDER=openai + OPENAI_API_KEY to use gpt-image-1.
//
// Requires `cwebp` on PATH (brew install webp). Output is written to
//   public/images/posts/<slug>.webp  at exactly 1200x630.

import { writeFile, mkdir, rm, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const execFileP = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TARGET_W = 1200;
const TARGET_H = 630;
const RATIO = TARGET_W / TARGET_H;

const [, , slug, topic] = process.argv;

if (!slug || !topic) {
  console.error('Usage: node scripts/generate-hero.mjs <slug> "<topic sentence>"');
  process.exit(1);
}

// Build the full prompt from prompt/image.md, injecting the topic.
async function buildPrompt() {
  const md = await readFile(join(ROOT, 'prompt/image.md'), 'utf8');
  const block = md.match(/```\n([\s\S]*?)\n```/);
  const template = block
    ? block[1]
    : 'A premium cinematic 3D illustration for a SaaS / tech blog. Dark moody atmosphere, glassmorphism, soft neon accents (blue, purple, teal). Landscape, no text, no logos, no people.';
  return template.replace(/TOPIC:\s*/i, `TOPIC:\n${topic}\n`);
}

// Minimal PNG dimension reader (IHDR width/height at byte offsets 16/20).
function pngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// Pollinations: free, no API key, Flux-backed. Returns a sized image directly.
async function generatePollinations(prompt) {
  console.log('Provider: Pollinations (Flux, free)');
  const seed = Math.floor(Math.random() * 1e9);
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${TARGET_W}&height=${TARGET_H}&model=flux&nologo=true&seed=${seed}`;

  // Pollinations renders on demand and can take 10-40s; allow a long timeout.
  const res = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!res.ok) throw new Error(`Pollinations ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generateOpenAI(prompt) {
  console.log('Provider: OpenAI (gpt-image-1)');
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', n: 1 }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return Buffer.from(json.data[0].b64_json, 'base64');
}

// Encode to webp. Pollinations already returns 1200x630, so skip the crop;
// other-sized provider images get center-cropped to the target ratio first.
async function toWebp(imgBuf, outPath, skipCrop) {
  const tmpDir = join(ROOT, 'scripts/.tmp');
  await mkdir(tmpDir, { recursive: true });
  const tmpIn = join(tmpDir, `${slug}.in`);
  await writeFile(tmpIn, imgBuf);

  const args = ['-q', '90'];
  if (!skipCrop) {
    const { width, height } = pngSize(imgBuf);
    let cropW = width;
    let cropH = Math.round(width / RATIO);
    if (cropH > height) {
      cropH = height;
      cropW = Math.round(height * RATIO);
    }
    const x = Math.floor((width - cropW) / 2);
    const y = Math.floor((height - cropH) / 2);
    args.push('-crop', String(x), String(y), String(cropW), String(cropH));
  }
  args.push('-resize', String(TARGET_W), String(TARGET_H), tmpIn, '-o', outPath);

  await execFileP('cwebp', args);
  await rm(tmpDir, { recursive: true, force: true });
}

async function main() {
  const prompt = await buildPrompt();
  const provider = (process.env.IMAGE_PROVIDER || 'pollinations').toLowerCase();

  let imgBuf;
  let skipCrop = false;
  if (provider === 'openai') {
    imgBuf = await generateOpenAI(prompt);
  } else {
    imgBuf = await generatePollinations(prompt);
    skipCrop = true; // already 1200x630
  }

  const outDir = join(ROOT, 'public/images/posts');
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, `${slug}.webp`);
  await toWebp(imgBuf, outPath, skipCrop);
  console.log(`✓ Hero written: public/images/posts/${slug}.webp (1200x630)`);
}

main().catch((err) => {
  console.error('Hero generation failed:', err.message);
  process.exit(1);
});
