import { app } from '../../lib/slack-app.ts';

export const deleteQuestionAndAnswer = async ({ text, channelId, messageTs, userId }: { text : string, channelId: string, messageTs : string, userId: string}) => {
  try {
    const userInfo = await app.client.users.info({ user: userId });
    const userAvatar = userInfo?.user?.profile?.image_512; 
    await app.client.chat.delete({ channel: channelId, ts: messageTs });
    await app.client.chat.postMessage({
      channel: channelId,
      text: text,
      username:userInfo?.user?.real_name,
      icon_url: userAvatar,
    });
  } catch (error) {
    console.log(error);
  }
}