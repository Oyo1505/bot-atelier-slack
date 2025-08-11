import { SurveyRepository } from '../ports/SurveyRepository';
import { UserRepository } from '../ports/UserRepository';
import { MessagingPort } from '../ports/MessagingPort';
import { SurveyReport } from '../entities/Survey';

export class GenerateReportUseCase {
  constructor(
    private surveyRepository: SurveyRepository,
    private userRepository: UserRepository,
    private messagingPort: MessagingPort
  ) {}

  async execute(authorizedUserId: string): Promise<SurveyReport> {

    const isAuthorized = await this.userRepository.isAuthorizedUser(authorizedUserId);
    if (!isAuthorized) {
      throw new Error('Utilisateur non autorisé');
    }


    const survey = await this.surveyRepository.getLatestSurvey();
    if (!survey) {
      throw new Error('Aucun sondage trouvé');
    }


    const report = await this.surveyRepository.generateReport(survey.id);


    await this.sendReportToUser(authorizedUserId, survey, report);

    return report;
  }

  private async sendReportToUser(userId: string, survey: any, report: SurveyReport): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    
    await this.messagingPort.sendMessage({
      channelId: user.id,
      text: `Salut <@${user.id}> ! Pour le questionnaire : ${survey.name}`
    });


    await this.messagingPort.sendMessage({
      channelId: user.id,
      text: `Le nombre total d'utilisateurs à avoir répondu est de ${report.totalUsers}`
    });


    for (const questionResult of report.questionResults) {
      const resultText = `Pour la question "${questionResult.questionText}" le pourcentage par réponse est :${
        questionResult.optionResults.map(option => 
          `\n ${option.optionText}: ${Math.round(option.percentage)}%`
        ).join('')
      }`;

      await this.messagingPort.sendMessage({
        channelId: user.id,
        text: resultText
      });
    }
  }
}
