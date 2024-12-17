import { app } from "../../lib/slack-app.js";

export const openDirectMessage = async (userId) => {
  try {
    const result = await app.client.conversations.open({
      users: userId,
    });
    return result.channel.id; 
  } catch (error) {
    console.error('Erreur lors de l’ouverture de la conversation directe :', error);
    throw error;
  }
};
