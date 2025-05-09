export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
  featuredImage?: string;
  categories: string[];
  tags: string[];
}
