import { app } from '../../lib/slack-app.ts';
import { SlackActionMiddlewareArgs, BlockButtonAction } from '@slack/bolt';
import { questions } from '../questions/random-question.ts';
import { postAnswerOnThread } from './post_answer-on-thread.ts';
import { checkIfUserCanReplyToTheSurvey } from '../../utils/google-drive/check-if-user-can-reply-to-survey.ts';
import { checkIfUserAlreadyResponded } from '../../utils/google-drive/check-user-already-responded.ts';
import { deleteQuestionAndAnswer } from '../questions/delete_question-and-answer.ts';
import { postBlocksQuestionAsUser } from './post_message-as-user.ts';
import { appendToGoogleSheets } from '../../utils/google-drive/send-file-to-google-drive.ts';
import { postMessageAsUser } from '../../utils/slack/post-message-as-user.ts';

type Button = {
  actionId:string
  sheetId: string
  blockId:string
}

export const actionFromBlockButton = async ({actionId, sheetId, blockId}:Button) => {
  app.action(actionId, async ({ ack, body }: SlackActionMiddlewareArgs<BlockButtonAction>) => {
    
      const actionId = body.actions[0].action_id;
      const textAction = body.actions[0].text.text;
      const userId = body.user.id;
      const channelId = body.container.channel_id;
      const messageTs = body.container.message_ts;
      const userName = body.user.name;

      try{
        
        await ack();


        const canReply = await checkIfUserCanReplyToTheSurvey({sheetId, messageTs, userId, blockId});
        if(!canReply) return

        const isAlreadyResponded = await checkIfUserAlreadyResponded({ userId, sheetId, blockId });
        const currentQuestionIndex = questions.findIndex(q => q.blocks[0].block_id === blockId);
        const nextQuestion = questions[currentQuestionIndex + 1];
     //   await deleteQuestionAndAnswer({ text: textAction, channelId, messageTs });
        await postMessageAsUser({ text:textAction,channelId, userId })
        if(!isAlreadyResponded) {
         
          const isAddedToSheet = await appendToGoogleSheets({ userId, userName, answerText: textAction, answerId: actionId, sheetId, blockId, messageTs:messageTs });
            
          if (isAddedToSheet) {

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
          }
          return
      }catch (error) {
        console.error("Erreur lors du traitement de l'action :", error);
      }
  });
};

