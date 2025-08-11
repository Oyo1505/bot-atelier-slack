import { SlackCommandMiddlewareArgs } from '@slack/bolt';
import { CreateSurveyUseCase } from '../domain/use-cases/CreateSurveyUseCase';
import { GenerateReportUseCase } from '../domain/use-cases/GenerateReportUseCase';
import { UserRepository } from '../domain/ports/UserRepository';
import { SurveyRepository } from '../domain/ports/SurveyRepository';
import { MessagingPort } from '../domain/ports/MessagingPort';

export class SlackCommandHandler {
  constructor(
    private userRepository: UserRepository,
    private surveyRepository: SurveyRepository,
    private messagingPort: MessagingPort
  ) {}

  async handleSurveyCommand({ ack, body }: SlackCommandMiddlewareArgs): Promise<void> {
    try {
      await ack();
      
      const createSurveyUseCase = new CreateSurveyUseCase(
        this.surveyRepository,
        this.userRepository,
        this.messagingPort
      );

      await createSurveyUseCase.execute(body.user_id);
    } catch (error) {
      console.error('Erreur lors de la création du sondage:', error);
    }
  }

  async handleRapportCommand({ ack, body }: SlackCommandMiddlewareArgs): Promise<void> {
    try {
      await ack();
      
      const generateReportUseCase = new GenerateReportUseCase(
        this.surveyRepository,
        this.userRepository,
        this.messagingPort
      );

      await generateReportUseCase.execute(body.user_id);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
    }
  }
}
