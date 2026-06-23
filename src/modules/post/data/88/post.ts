import type { PostSource } from '../../post.source.type';

// SEO: primary="multi-agent security" | secondary="agent cascading injection, confused deputy ai, inter-agent trust, prompt infection"
export const post: PostSource = {
  id: '88',
  title: 'One Poisoned Agent Infects the Whole Chain',
  slug: 'multi-agent-security',
  excerpt:
    'Multi-agent security fails because agents trust each other implicitly. Why a single compromised agent cascades through every collaborator, and why the single-agent defense model does not extend to chains.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'Agents', slug: 'agents' },
    { name: 'Orchestration', slug: 'orchestration' },
    { name: 'Compliance', slug: 'compliance' },
    { name: 'Production', slug: 'production' },
    { name: 'Architecture', slug: 'architecture' },
  ],
  imageId: '/images/posts/multi-agent-security.webp',
  publishedAt: '2026-07-29T13:00:00.000Z',
  featured: false,
  trendingScore: 27,
};
