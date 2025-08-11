export interface SurveyQuestion {
  id: string;
  question: string;
  options: SurveyOption[];
}

export interface SurveyOption {
  id: string;
  text: string;
  value: string;
}

export interface Survey {
  id: string;
  name: string;
  questions: SurveyQuestion[];
  createdAt: Date;
  responses: SurveyResponse[];
}

export interface SurveyResponse {
  userId: string;
  userName: string;
  questionId: string;
  answerId: string;
  answerText: string;
  timestamp: number;
}

export interface SurveyReport {
  totalUsers: number;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  questionText: string;
  optionResults: OptionResult[];
}

export interface OptionResult {
  optionText: string;
  percentage: number;
}
