import { SurveyRepository } from '../ports/SurveyRepository';
import { UserRepository } from '../ports/UserRepository';
import { MessagingPort } from '../ports/MessagingPort';
import { Survey } from '../entities/Survey';

export class CreateSurveyUseCase {
  constructor(
    private surveyRepository: SurveyRepository,
    private userRepository: UserRepository,
    private messagingPort: MessagingPort
  ) {}

  async execute(authorizedUserId: string): Promise<Survey> {
  
    const isAuthorized = await this.userRepository.isAuthorizedUser(authorizedUserId);
    if (!isAuthorized) {
      throw new Error('Utilisateur non autorisé');
    }


    const date = new Date();
    const surveyName = `Questions atelier du ${date.toLocaleDateString('fr-FR')}`;
    const survey = await this.surveyRepository.createSurvey(surveyName);


    await this.sendQuestionsToUsers(survey);

    return survey;
  }

  private async sendQuestionsToUsers(survey: Survey): Promise<void> {
    const users = await this.userRepository.findActiveUsers();
    
    for (const user of users) {
      try {
        const channelId = await this.messagingPort.openDirectMessage(user.id);
        const firstQuestion = survey.questions[0];
        
        await this.messagingPort.sendMessage({
          channelId,
          text: firstQuestion.question,
          blocks: this.createQuestionBlocks(firstQuestion)
        });
      } catch (error) {
        console.error(`Erreur lors de l'envoi à l'utilisateur ${user.id}:`, error);
      }
    }
  }

  private createQuestionBlocks(question: any): any[] {
  
    return question.blocks || [];
  }
}
