import { app } from '../../lib/slack-app.ts';
import { SlackActionMiddlewareArgs, BlockButtonAction } from '@slack/bolt';
import { questions } from '../questions/random-question.ts';
import { postAnswerOnThread } from './post_answer-on-thread.ts';
import { checkIfUserCanReplyToTheSurvey } from '../../utils/google-drive/check-if-user-can-reply-to-survey.ts';
import { checkIfUserAlreadyResponded } from '../../utils/google-drive/check-user-already-responded.ts';
import { deleteQuestionAndAnswer } from '../questions/delete_question-and-answer.ts';
import { postBlocksQuestionAsUser } from './post_message-as-user.ts';
import { appendToGoogleSheets } from '../../utils/google-drive/send-file-to-google-drive.ts';

type Button = {
  idButton:string
  sheetId: string
  blockId:string
}

export const actionFromBlockButton = async ({idButton, sheetId, blockId}:Button) => {
  app.action(idButton, async ({ ack, body }: SlackActionMiddlewareArgs<BlockButtonAction>) => {
    
      const actionId = body.actions[0].action_id;
      const textAction = body.actions[0].text.text;
      const userId = body.user.id;
      const channelId = body.container.channel_id;
      const messageTs = body.container.message_ts;
      const userName = body.user.name;

      try{
        
        await ack();
        await deleteQuestionAndAnswer({ text: textAction, channelId, messageTs, userId });
        const canReply = await checkIfUserCanReplyToTheSurvey({sheetId, messageTs, userId, blockId});
        if(!canReply) return
        const isAlreadyResponded = await checkIfUserAlreadyResponded({ userId, sheetId, blockId });
        if(!isAlreadyResponded) {
         
          const isAddedToSheet = await appendToGoogleSheets({ userId, userName, answerText: textAction, answerId: actionId, sheetId, blockId, messageTs:messageTs });
            
          if (isAddedToSheet) {
            const currentQuestionIndex = questions.findIndex(q => q.blocks[0].block_id === blockId);
            const nextQuestion = questions[currentQuestionIndex + 1];
              if (nextQuestion) {
                
                await app.client.chat.postMessage({
                  channel: channelId,
                  text: `${nextQuestion.question}`,
                });

                await postBlocksQuestionAsUser({ channelId, userId, blocks: nextQuestion.blocks });
                
              } else {
                await app.client.chat.postMessage({
                  channel: channelId,
                  text: `Merci <@${userId}> d'avoir répondu à toutes les questions ! 🎉`,
                });
              }
            } 
          }else {
            await postAnswerOnThread({channelId, messageTs, textAction:'Tu as déjà répondu à cette question.'})
          }
      }catch (error) {
        console.error("Erreur lors du traitement de l'action :", error);
      }
  });
};

