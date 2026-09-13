export type Language = 'en' | 'ar' | 'both';
export interface Question {
  id: string;
  prompt: { ar: string; en: string };
  answer: { ar: string; en: string };
  codeHtml: string;
  kind: 'output' | 'discussion';
  review: { status: string; lastReviewedAt: string | null; versionNotes: string };
}
export interface Topic {
  id: string;
  title: string;
  titleAr: string;
  stage: string;
  description: string;
  sources: { title: string; url: string }[];
  questions: Question[];
}
export interface Track {
  schemaVersion: number;
  id: string;
  title: string;
  level: string;
  description: string;
  topics: Topic[];
}
export interface Progress {
  version: 1;
  learned: string[];
  saved: string[];
  lastQuestion: string | null;
  language: Language;
}
