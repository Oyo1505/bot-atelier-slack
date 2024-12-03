import { app } from '../lib/slack-app.js';

export const postBlocksQuestionAsUser = async ({ channelId, userId, blocks }) => {
  try {
    const userInfo = await app.client.users.info({ user: userId });
    const userAvatar = userInfo.user.profile.image_512; 
    const actionBlocks = blocks.filter(block => block.type === 'actions');
    await app.client.chat.postMessage({
      channel: channelId,
      text:" ",
      blocks: actionBlocks,
      username: userInfo.user.real_name,
      icon_url: userAvatar,
    });
  } catch (error) {
    console.log(error);
  }
 
};