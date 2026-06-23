import type { PostSource } from '../../post.source.type';

// SEO: primary="prompt injection rce" | secondary="ai agent security, indirect prompt injection, tool call hijack, llm remote code execution"
export const post: PostSource = {
  id: '71',
  title: 'Prompt Injection Is a Remote Shell Now',
  slug: 'prompt-injection-rce',
  excerpt:
    'Prompt injection RCE turned a text trick into host compromise in 2026. Why giving agents tools collapsed the data-instruction boundary, and the architecture that contains the blast radius.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'Agents', slug: 'agents' },
    { name: 'Compliance', slug: 'compliance' },
    { name: 'Production', slug: 'production' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Infrastructure', slug: 'infrastructure' },
  ],
  imageId: '/images/posts/prompt-injection-rce.webp',
  publishedAt: '2026-07-12T13:00:00.000Z',
  featured: false,
  trendingScore: 28,
};
