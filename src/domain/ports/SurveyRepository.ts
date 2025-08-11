import { Survey, SurveyResponse, SurveyReport } from '../entities/Survey';

export interface SurveyRepository {
  createSurvey(name: string): Promise<Survey>;
  getLatestSurvey(): Promise<Survey | null>;
  saveResponse(response: SurveyResponse): Promise<void>;
  getSurveyResponses(surveyId: string): Promise<SurveyResponse[]>;
  generateReport(surveyId: string): Promise<SurveyReport>;
  checkUserAlreadyResponded(userId: string, surveyId: string, questionId: string): Promise<boolean>;
  checkUserCanReplyToSurvey(userId: string, surveyId: string, messageTimestamp: number): Promise<boolean>;
}
