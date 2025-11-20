export interface JournalEntry {
  id: string;
  content: string;
  timestamp: number;
  dateString: string;
}

export interface MoodPoint {
  date: string;
  score: number; // 0 to 100
}

export interface ThemeItem {
  theme: string;
  count: number;
}

export interface AnalysisResult {
  overallVibe: string;
  moodTrend: MoodPoint[];
  topThemes: ThemeItem[];
  personalizedAdvice: string;
}

export enum Tab {
  WRITE = 'WRITE',
  HISTORY = 'HISTORY',
  INSIGHTS = 'INSIGHTS',
}
