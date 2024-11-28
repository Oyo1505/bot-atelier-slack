import { app } from '../lib/slack-app.js';

export const postAnswerOnThread = async ({channelId, messageTs, userId, textAction}) => {
  await app.client.chat.postMessage({
    channel: channelId,
    thread_ts: messageTs,
    text: `C'est noté <@${userId}>! Tu as choisi **${textAction}** !`,
  });
};
