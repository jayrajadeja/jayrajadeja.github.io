export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
}

export interface VelocityNugget {
  id: string;
  number: string;
  title: string;
  quote: string;
  icon: string;
}

export interface ResearchPaper {
  id: string;
  source: string;
  title: string;
  authors: string;
  description: string;
  link: string;
  icon: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverImage: string;
  link: string;
  icon: string;
}
