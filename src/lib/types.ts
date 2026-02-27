export interface FeedbackItem {
  id: string;
  type: 'issue' | 'warning' | 'suggestion';
  title: string;
  description: string;
  original?: string;
  suggested?: string;
  reason: string;
  location: string;
}

export interface AnalysisResult {
  fileName: string;
  summary: string;
  overallScore: number;
  scores: {
    structure: number;
    citations: number;
    grammar: number;
    style: number;
  };
  feedback: {
    structure: FeedbackItem[];
    citations: FeedbackItem[];
    grammar: FeedbackItem[];
    style: FeedbackItem[];
  };
  documentText: string;
}

export interface UserProfile {
  name: string;
  email: string;
  joinedDate: string;
}

export interface AnalysisHistory {
  id: string;
  fileName: string;
  date: string;
  overallScore: number;
  scores: {
    structure: number;
    citations: number;
    grammar: number;
    style: number;
  };
}
