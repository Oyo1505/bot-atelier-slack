import { SlackActionMiddlewareArgs, BlockButtonAction } from '@slack/bolt';
import { ProcessSurveyResponseUseCase } from '../domain/use-cases/ProcessSurveyResponseUseCase';
import { SurveyRepository } from '../domain/ports/SurveyRepository';
import { MessagingPort } from '../domain/ports/MessagingPort';

export class SlackActionHandler {
  constructor(
    private surveyRepository: SurveyRepository,
    private messagingPort: MessagingPort
  ) {}

  async handleSurveyResponse({ ack, body }: SlackActionMiddlewareArgs<BlockButtonAction>): Promise<void> {
    try {
      await ack();
      
      const channelId = body.container.channel_id;
      const currentBlockId = body?.message?.blocks[0].block_id;
      const actionId = body.actions[0].action_id;
      const textAction = body.actions[0].text.text;
      const userId = body.user.id;
      const messageTs = body.container.message_ts;
      const userName = body.user.name;

      if (!currentBlockId || !actionId || !textAction || !userId || !messageTs || !userName) {
        throw new Error('Données manquantes pour traiter la réponse');
      }

      const processSurveyResponseUseCase = new ProcessSurveyResponseUseCase(
        this.surveyRepository,
        this.messagingPort
      );

      await processSurveyResponseUseCase.execute({
        userId,
        userName,
        questionId: currentBlockId,
        answerId: actionId,
        answerText: textAction,
        channelId,
        messageTs
      });
    } catch (error) {
      console.error('Erreur lors du traitement de l\'action:', error);
    }
  }
}
