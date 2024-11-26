
import { app } from '../lib/slack-app.js';
import { appendToGoogleSheets } from '../utils/send-file-to-google-drive/send-file-to-google-drive.js';

export const actionFromBlockButton = async (idButton, indexButton, sheetId) => {
    app.action(idButton, async ({ ack, say, body }) => {
  
    const actionId = body.actions[0].action_id;
    const textAction = body.actions[0].text.text;
    const userId = body.user.id; 
    const messageTs = body.container.message_ts;
    const channelId = body.container.channel_id;
    const userName = body.user.name

    await ack();
    app.client.chat.postMessage({
      channel: channelId,
      thread_ts: messageTs,
      text: `C'est noté <@${userId}>! Tu as choisi **Option ${indexButton}** !`,
    });
    appendToGoogleSheets({userId: body.container.channel_id,userName, answerText: textAction, answerId: actionId, sheetId});
  });
};

