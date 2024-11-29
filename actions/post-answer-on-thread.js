import { app } from '../lib/slack-app.js';

export const postAnswerOnThread = async ({channelId, messageTs, textAction}) => {
  await app.client.chat.postMessage({
    channel: channelId,
    thread_ts: messageTs,
    text: textAction,
  });
};
