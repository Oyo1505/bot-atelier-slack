import { app } from '../../lib/slack-app.ts';

export const postAnswerOnThread = async ({channelId, messageTs, textAction}: { channelId:string, messageTs: string, textAction:string}) => {
  try {
    await app.client.chat.postMessage({
      channel: channelId,
      thread_ts: messageTs,
      text: textAction,
    });
  } catch (error) {
    console.log(error);
  }
};