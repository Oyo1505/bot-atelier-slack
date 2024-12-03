
import { app } from '../lib/slack-app.js';
import { appendToGoogleSheets } from '../utils/google-drive/send-file-to-google-drive/send-file-to-google-drive.js';
import { questions } from '../utils/questions/random-question/random-question.js';
import { postAnswerOnThread } from './post-answer-on-thread.js';
import { getSheetFromGoogleDrive } from '../utils/google-drive/get-sheet-from-google-drive/get-sheet-from-google-drive.js';
import { checkIfUserCanReplyToTheSurvey } from '../utils/google-drive/check-if-user-can-reply-to-survey/check-if-user-can-reply-to-survey.js';
import { checkIfUserAlreadyResponded } from '../utils/google-drive/check-user-already-responded/check-user-already-responded.js';
import { deleteQuestionAndAnswer } from './delete-question-and-answer.js';

const getUserProgress = async ({ userId, sheetId }) => {
  try {
    const sheetData = await getSheetFromGoogleDrive(sheetId);
    const userResponses = sheetData.filter(row => row[0] === userId);
    const lastBlockId = userResponses.length > 0 ? userResponses[userResponses.length - 1][4] : null;
    return lastBlockId;
  } catch (error) {
    console.log(error);
  }
};

export const actionFromBlockButton = async ({idButton, sheetId}) => {
  app.action(idButton, async ({ ack, body }) => {
    const actionId = body.actions[0].action_id;
    const textAction = body.actions[0].text.text;
    const userId = body.user.id;
    const channelId = body.container.channel_id;
    const messageTs = body.container.message_ts;
    const userName = body.user.name;
    const currentBlockId = body.message.blocks[0].block_id;
    const isAlreadyResponded = await checkIfUserAlreadyResponded({ userId, sheetId, blockId:currentBlockId });
    const canReply = await checkIfUserCanReplyToTheSurvey({sheetId, messageTs, userId, blockId:currentBlockId});
    
    if(!canReply) return
    if(!isAlreadyResponded) {
      await ack();
      const isHasBeenAddToTheSheet = await appendToGoogleSheets({ userId, userName, answerText: textAction, answerId: actionId, sheetId, blockId:currentBlockId, messageTs:messageTs });
        
      if (isHasBeenAddToTheSheet) {
          const lastBlockId = await getUserProgress({ userId, sheetId});
          const currentQuestionIndex = questions.findIndex(q => q.blocks[0].block_id === lastBlockId);
          const nextQuestion = questions[currentQuestionIndex + 1];

          if (nextQuestion) {
            await deleteQuestionAndAnswer({ text: `${body.actions[0].text.text}`, channelId, messageTs, userId });
            await app.client.chat.postMessage({
              channel: channelId,
              text: `${nextQuestion.question}`,
              blocks: nextQuestion.blocks,
            });
          } else {
            await deleteQuestionAndAnswer({ text: `${body.actions[0].text.text}`, channelId, messageTs, userId }).then(async()=>{
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

