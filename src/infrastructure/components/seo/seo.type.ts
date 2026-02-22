export interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedAt?: string;
  updatedAt?: string;
}
