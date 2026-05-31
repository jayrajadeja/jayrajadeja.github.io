export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  venue: string;
  why: string;
  link: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  note: string;
}

export interface WorkCaseFile {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  tags: string[];
}

export interface ExperienceEntry {
  id: string;
  org: string;
  title: string;
  start: string;
  end: string | null;
  location: string;
  summary: string;
}

export interface StudiedSystem {
  id: string;
  system: string;
  flagship?: boolean;
  note: string;
}

export interface AnimeEntry {
  id: string;
  title: string;
  kind: "anime" | "manga";
}

export interface FieldNote {
  id: string;
  number: string;
  title: string;
  quote: string;
  tag: string;
}

export interface InterestsData {
  f1: { favoriteTeam: string; favoriteDrivers: string[]; note: string };
  markets: { note: string; focus: string[] };
  sport: { note: string };
}

export interface NowData {
  updated: string;
  building: string;
  reading: string[];
  watching: string;
  exploring: string;
}

export interface UsesData {
  editor: string;
  terminal: string;
  languages: string[];
  datastores: string[];
  note: string;
}
