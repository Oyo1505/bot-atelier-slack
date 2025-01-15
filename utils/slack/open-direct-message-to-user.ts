import { app } from "../../lib/slack-app.ts";

export const openDirectMessage = async (userId:string) => {
  try {
    const result = await app.client.conversations.open({
      users: userId,
    });
   
    if (result.channel && result.channel.id) {
      return result.channel.id;
    } else {
      throw new Error('Failed to open direct message: channel is undefined');
    }
  } catch (error) {
    console.error('Erreur lors de l’ouverture de la conversation directe :', error);
    throw error;
  }
};
