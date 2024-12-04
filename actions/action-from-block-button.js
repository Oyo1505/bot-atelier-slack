
import { app } from '../lib/slack-app.js';
import { appendToGoogleSheets } from '../utils/google-drive/send-file-to-google-drive.js';
import { questions } from '../utils/questions/random-question.js';
import { postAnswerOnThread } from './post-answer-on-thread.js';
import { checkIfUserCanReplyToTheSurvey } from '../utils/google-drive/check-if-user-can-reply-to-survey.js';
import { checkIfUserAlreadyResponded } from '../utils/google-drive/check-user-already-responded.js';
import { deleteQuestionAndAnswer } from './delete-question-and-answer.js';
import { postBlocksQuestionAsUser } from './post-message-as-user.js';

export const actionFromBlockButton = async ({idButton, sheetId, blockId}) => {
  app.action(idButton, async ({ ack, body }) => {
    const actionId = body.actions[0].action_id;
    const textAction = body.actions[0].text.text;
    const userId = body.user.id;
    const channelId = body.container.channel_id;
    const messageTs = body.container.message_ts;
    const userName = body.user.name;
    const isAlreadyResponded = await checkIfUserAlreadyResponded({ userId, sheetId, blockId });
    const canReply = await checkIfUserCanReplyToTheSurvey({sheetId, messageTs, userId, blockId});
    const currentQuestionIndex = questions.findIndex(q => q.blocks[0].block_id === blockId);
    const nextQuestion = questions[currentQuestionIndex + 1];

    if(!canReply) return
    if(!isAlreadyResponded) {
      await ack();
      const isHasBeenAddToTheSheet = await appendToGoogleSheets({ userId, userName, answerText: textAction, answerId: actionId, sheetId, blockId, messageTs:messageTs });
        
      if (isHasBeenAddToTheSheet) {
          if (nextQuestion) {
            await deleteQuestionAndAnswer({ text: textAction, channelId, messageTs, userId });
            await app.client.chat.postMessage({
              channel: channelId,
              text: `${nextQuestion.question}`,
            });
            await postBlocksQuestionAsUser({ channelId, userId, blocks: nextQuestion.blocks });
          } else {
            await deleteQuestionAndAnswer({ text: textAction, channelId, messageTs, userId }).then(async()=>{
              await app.client.chat.postMessage({
                channel: channelId,
                text: `Merci <@${userId}> d'avoir répondu à toutes les questions ! 🎉`,
              });
            }).catch(error => console.error(error))
          }
        } 
      }else {
        await ack();
        await postAnswerOnThread({channelId, messageTs, textAction:'Tu as déjà répondu à cette question.'})
      }
  });
};

