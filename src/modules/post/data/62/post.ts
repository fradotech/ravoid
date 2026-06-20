import type { PostSource } from '../../post.source.type';

// SEO: primary="ai agent evaluation cost" | secondary="agent eval harness, llm eval, silent regression, agent observability"
export const post: PostSource = {
  id: '62',
  title: "Your AI Agent Is Regressing and You Can't See It",
  slug: 'ai-agent-evaluation-cost',
  excerpt:
    'AI agent evaluation cost is the budget line nobody plans, so quality regresses silently. Without an eval harness, a prompt tweak degrades the agent and no dashboard shows it. What evals really cost.',
  tags: [
    { name: 'Agents', slug: 'agents' },
    { name: 'AI', slug: 'ai' },
    { name: 'Observability', slug: 'observability' },
    { name: 'Production', slug: 'production' },
    { name: 'Cost Analysis', slug: 'cost-analysis' },
    { name: 'LLM', slug: 'llm' },
  ],
  imageId: '/images/posts/ai-agent-evaluation-cost.webp',
  publishedAt: '2026-07-03T10:00:00.000Z',
  featured: false,
  trendingScore: 24,
};
