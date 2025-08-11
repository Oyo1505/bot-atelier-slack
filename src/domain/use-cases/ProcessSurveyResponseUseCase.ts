import { SurveyRepository } from '../ports/SurveyRepository';
import { MessagingPort } from '../ports/MessagingPort';
import { SurveyResponse } from '../entities/Survey';

export class ProcessSurveyResponseUseCase {
  constructor(
    private surveyRepository: SurveyRepository,
    private messagingPort: MessagingPort
  ) {}

  async execute(params: {
    userId: string;
    userName: string;
    questionId: string;
    answerId: string;
    answerText: string;
    channelId: string;
    messageTs: string;
  }): Promise<void> {
    const { userId, userName, questionId, answerId, answerText, channelId, messageTs } = params;

    const survey = await this.surveyRepository.getLatestSurvey();
    if (!survey) {
      throw new Error('Aucun sondage actif trouvé');
    }

    const canReply = await this.surveyRepository.checkUserCanReplyToSurvey(
      userId, 
      survey.id, 
      parseInt(messageTs)
    );
    if (!canReply) {
      return;
    }


    const alreadyResponded = await this.surveyRepository.checkUserAlreadyResponded(
      userId, 
      survey.id, 
      questionId
    );

    await this.messagingPort.deleteMessage(channelId, messageTs);


    await this.messagingPort.postMessageAsUser(userId, {
      channelId,
      text: answerText
    });

    if (!alreadyResponded) {
      const response: SurveyResponse = {
        userId,
        userName,
        questionId,
        answerId,
        answerText,
        timestamp: parseInt(messageTs)
      };

      await this.surveyRepository.saveResponse(response);


      await this.sendNextQuestion(channelId, questionId, userId);
    }
  }

  private async sendNextQuestion(channelId: string, currentQuestionId: string, userId: string): Promise<void> {
    const survey = await this.surveyRepository.getLatestSurvey();
    if (!survey) return;

    const currentIndex = survey.questions.findIndex(q => q.id === currentQuestionId);
    const nextQuestion = survey.questions[currentIndex + 1];

    if (!nextQuestion) {
      await this.messagingPort.sendMessage({
        channelId,
        text: `Merci <@${userId}> d'avoir répondu à toutes les questions ! 🎉`
      });
      return;
    }

    await this.messagingPort.sendMessage({
      channelId,
      text: nextQuestion.question,
      blocks: this.createQuestionBlocks(nextQuestion)
    });
  }

  private createQuestionBlocks(question: any): any[] {
    return question.blocks || [];
  }
}
