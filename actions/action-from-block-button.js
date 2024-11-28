
import { app } from '../lib/slack-app.js';
import { appendToGoogleSheets } from '../utils/google-drive/send-file-to-google-drive/send-file-to-google-drive.js';
import { checkIfUserIsInSheet } from '../utils/google-drive/check-user-answe-in-sheet/check-user-answe-in-sheet.js';
import { questions } from '../utils/questions/random-question/random-question.js';
import { postAnswerOnThread } from './post-answer-on-thread.js';
import { getSheetFromGoogleDrive } from '../utils/google-drive/get-sheet-from-google-drive/get-sheet-from-google-drive.js';

const getUserProgress = async ({ userId, sheetId }) => {
  const sheetData = await getSheetFromGoogleDrive(sheetId);
  const userResponses = sheetData.filter(row => row[0] === userId);
  const lastBlockId = userResponses.length > 0 ? userResponses[userResponses.length - 1][4] : null;
  return lastBlockId;
};

export const actionFromBlockButton = async (idButton, sheetId) => {
  app.action(idButton, async ({ ack, body }) => {
    const actionId = body.actions[0].action_id;
    const textAction = body.actions[0].text.text;
    const userId = body.user.id;
    const channelId = body.container.channel_id;
    const messageTs = body.container.message_ts;
    const userName = body.user.name;
    const currentBlockId = body.message.blocks[0].block_id;
    const isAlreadyInSheet = await checkIfUserIsInSheet({ userId, sheetId, blockId:currentBlockId });

    if (!isAlreadyInSheet) {
    await ack();
    const isHasBeenAddToTheSheet = await appendToGoogleSheets({ userId, userName, answerText: textAction, answerId: actionId, sheetId, blockId:currentBlockId });
      if (isHasBeenAddToTheSheet) {
        
        const lastBlockId = await getUserProgress({ userId, sheetId});
       
        const currentQuestionIndex = questions.findIndex(q => q.blocks[0].block_id === lastBlockId);
        const nextQuestion = questions[currentQuestionIndex + 1];

        if (nextQuestion) {
          await postAnswerOnThread({channelId, messageTs, userId, textAction})
          await app.client.chat.postMessage({
            channel: channelId,
            text: `Question suivante : ${nextQuestion.question}`,
            blocks: nextQuestion.blocks,
          });
        } else {
          await postAnswerOnThread({channelId, messageTs, userId, textAction})
          await app.client.chat.postMessage({
            channel: channelId,
            text: `Merci <@${userId}> d'avoir répondu à toutes les questions ! 🎉`,
          });
        }
      } 
      }else {
        await ack();
        app.client.chat.postMessage({
          channel: channelId,
          thread_ts: messageTs,
          text: `Tu as déjà répondu à cette question.`,
        });
      }
  });
};

