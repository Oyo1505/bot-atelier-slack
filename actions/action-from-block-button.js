
import { app } from '../lib/slack-app.js';
import { appendToGoogleSheets } from '../utils/send-file-to-google-drive/send-file-to-google-drive.js';
import { checkIfUserIsInSheet } from '../utils/check-user-answe-in-sheet/check-user-answe-in-sheet.js';

export const actionFromBlockButton = async (idButton, indexButton, sheetId) => {
    app.action(idButton, async ({ ack, say, body }) => {
  
    const actionId = body.actions[0].action_id;
    const blockId = body.actions[0].block_id;
    const textAction = body.actions[0].text.text;
    const userId = body.user.id; 
    const messageTs = body.container.message_ts;
    const channelId = body.container.channel_id;
    const userName = body.user.name
    const isAlreadyInSheet = await checkIfUserIsInSheet({userId, sheetId, blockId});

    if(!isAlreadyInSheet){
      await ack();
      app.client.chat.postMessage({
        channel: channelId,
        thread_ts: messageTs,
        text: `C'est noté <@${userId}>! Tu as choisi **Option ${indexButton}** !`,
      });
      appendToGoogleSheets({userId, userName, answerText: textAction, answerId: actionId, sheetId, blockId});
    }else{
      await ack();
      app.client.chat.postMessage({
        channel: channelId,
        thread_ts: messageTs,
        text: `Tu as déjà repondu a cette question.`,
      });
    }
  });
};

