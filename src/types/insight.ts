export type InsightSection = {
  heading?: string;
  paragraphs: string[];
  links?: { label: string; href: string }[];
};

export type InsightFaq = {
  question: string;
  answer: string;
};

export type InsightArticle = {
  slug: string;
  title: string;
  description: string;
  /** Maps to catalog parent category filter — omit for general trade guides */
  category: string | null;
  publishedAt: string;
  updatedAt?: string;
  readMinutes: number;
  tags: string[];
  sections: InsightSection[];
  relatedSlugs: string[];
  faqs?: InsightFaq[];
  /** Inline catalog links rendered in the article body */
  catalogLinks?: { label: string; href: string }[];
};
