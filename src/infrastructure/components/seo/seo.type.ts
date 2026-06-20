export interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogImageAlt?: string;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedAt?: string;
  updatedAt?: string;
  section?: string;
  tags?: string[];
}
