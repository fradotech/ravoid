import type { PostSource } from '../../post.source.type';

// SEO: primary="mcp tool poisoning" | secondary="mcp security, tool description injection, rug pull attack, ai agent security"
export const post: PostSource = {
  id: '76',
  title: 'Your Agent Reads Tool Metadata You Never See',
  slug: 'mcp-tool-poisoning',
  excerpt:
    'MCP tool poisoning hides instructions in tool descriptions the model reads but humans never review. Why approving a tool name is not approving its behavior, and how to close the review gap.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'Agents', slug: 'agents' },
    { name: 'Compliance', slug: 'compliance' },
    { name: 'Production', slug: 'production' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Tooling', slug: 'tooling' },
  ],
  imageId: '/images/posts/mcp-tool-poisoning.webp',
  publishedAt: '2026-07-17T02:00:00.000Z',
  featured: false,
  trendingScore: 27,
};
