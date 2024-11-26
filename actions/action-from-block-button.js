import { app } from '../lib/slack-app.js';

export const actionFromBlockButton = async (idButton, indexButton) => {
    app.action(idButton, async ({ ack, say, body }) => {
    
    const userId = body.user.id; 
    const messageTs = body.container.message_ts;
    const channelId = body.container.channel_id;
    
    await ack();
    app.client.chat.postMessage({
      channel: channelId,
      thread_ts: messageTs,
      text: `C'est noté <@${userId}>! Tu as choisi **Option ${indexButton}** !`,
    });
  });
};

