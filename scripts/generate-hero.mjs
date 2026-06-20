#!/usr/bin/env node
// Generate a 1200x630 hero image for a Ravoid post and compress to webp.
//
// Usage:
//   node scripts/generate-hero.mjs <slug> "<topic sentence>"
//
// Provider is auto-detected from env (set ONE of these):
//   REPLICATE_API_TOKEN   -> Flux 1.1 Pro (recommended, cinematic)
//   OPENAI_API_KEY        -> gpt-image-1
//
// Requires `cwebp` on PATH (brew install webp). Output is written to
//   public/images/posts/<slug>.webp  at exactly 1200x630.

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
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

// Minimal PNG dimension reader (IHDR width/height live at byte offsets 16/20).
function pngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function generateReplicate(prompt) {
  console.log('Provider: Replicate (Flux 1.1 Pro)');
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Prefer: 'wait',
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: '16:9',
          output_format: 'png',
          safety_tolerance: 2,
        },
      }),
    },
  );

  if (!res.ok) throw new Error(`Replicate ${res.status}: ${await res.text()}`);
  let pred = await res.json();

  // If it did not finish within the wait window, poll the prediction URL.
  while (pred.status === 'starting' || pred.status === 'processing') {
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await fetch(pred.urls.get, {
      headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
    });
    pred = await poll.json();
  }

  if (pred.status !== 'succeeded') {
    throw new Error(`Replicate prediction ${pred.status}: ${pred.error ?? ''}`);
  }

  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  const img = await fetch(url);
  return Buffer.from(await img.arrayBuffer());
}

async function generateOpenAI(prompt) {
  console.log('Provider: OpenAI (gpt-image-1)');
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1536x1024',
      n: 1,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return Buffer.from(json.data[0].b64_json, 'base64');
}

// Center-crop to the 1200x630 aspect ratio, then resize, then encode webp.
async function toWebp(pngBuf, outPath) {
  const tmpDir = join(ROOT, 'scripts/.tmp');
  await mkdir(tmpDir, { recursive: true });
  const tmpPng = join(tmpDir, `${slug}.png`);
  await writeFile(tmpPng, pngBuf);

  const { width, height } = pngSize(pngBuf);
  let cropW = width;
  let cropH = Math.round(width / RATIO);
  if (cropH > height) {
    cropH = height;
    cropW = Math.round(height * RATIO);
  }
  const x = Math.floor((width - cropW) / 2);
  const y = Math.floor((height - cropH) / 2);

  await execFileP('cwebp', [
    '-q', '90',
    '-crop', String(x), String(y), String(cropW), String(cropH),
    '-resize', String(TARGET_W), String(TARGET_H),
    tmpPng, '-o', outPath,
  ]);

  await rm(tmpDir, { recursive: true, force: true });
}

async function main() {
  const prompt = await buildPrompt();
  let pngBuf;

  if (process.env.REPLICATE_API_TOKEN) {
    pngBuf = await generateReplicate(prompt);
  } else if (process.env.OPENAI_API_KEY) {
    pngBuf = await generateOpenAI(prompt);
  } else {
    console.error(
      'No API key found. Set REPLICATE_API_TOKEN (recommended) or OPENAI_API_KEY and retry.',
    );
    process.exit(1);
  }

  const outDir = join(ROOT, 'public/images/posts');
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, `${slug}.webp`);
  await toWebp(pngBuf, outPath);
  console.log(`✓ Hero written: public/images/posts/${slug}.webp (1200x630)`);
}

main().catch((err) => {
  console.error('Hero generation failed:', err.message);
  process.exit(1);
});
