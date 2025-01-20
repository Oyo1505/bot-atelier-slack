import { app } from "../../lib/slack-app";

export const postMessageAsUser = async ({text, channelId, userId }: { text : string, channelId: string, userId: string}) => {

  try {
      const userInfo = await app.client.users.info({ user: userId });
      const userAvatar = userInfo?.user?.profile?.image_512; 
        await app.client.chat.postMessage({
          channel: channelId,
          text: text,
          username:userInfo?.user?.real_name,
          icon_url: userAvatar,
        });
      
    } catch (error) {
      console.log(error);
    }
};