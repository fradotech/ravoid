import type { PostSource } from '../../post.source.type';

// SEO: primary="shadow mcp" | secondary="ungoverned mcp servers, mcp governance, ai agent shadow it, mcp security inventory"
export const post: PostSource = {
  id: '82',
  title: 'Nobody Approved the MCP Tools Your Agents Use',
  slug: 'shadow-mcp',
  excerpt:
    'Shadow MCP is shadow IT for AI agents: tool servers wired up with real credentials and no security review. Why you cannot govern what you cannot see, and how to inventory and gate it before an audit does.',
  tags: [
    { name: 'AI', slug: 'ai' },
    { name: 'Agents', slug: 'agents' },
    { name: 'Compliance', slug: 'compliance' },
    { name: 'Production', slug: 'production' },
    { name: 'Tooling', slug: 'tooling' },
    { name: 'Engineering Leadership', slug: 'engineering-leadership' },
  ],
  imageId: '/images/posts/shadow-mcp.webp',
  publishedAt: '2026-07-23T13:00:00.000Z',
  featured: false,
  trendingScore: 27,
};
