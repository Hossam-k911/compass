export type Language = 'en' | 'ar' | 'both';
export interface Source { title: string; url: string }
export interface ExerciseCase {
  label: { ar: string; en: string };
  code: string;
  expected: { stdout: string[]; error?: string };
}
export interface Question {
  id: string;
  prompt: { ar: string; en: string };
  answer: { ar: string; en: string };
  codeHtml: string;
  kind: 'output' | 'discussion';
  exercise?: { runtime: string; cases: ExerciseCase[] };
  review: { status: string; lastReviewedAt: string | null; versionNotes: string; sources?: Source[] };
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
