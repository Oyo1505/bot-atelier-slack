import { app } from "../../lib/slack-app.js";

export const checkUserPresence = async (userId) => {
  try {
    const presence = await app.client.users.getPresence({
      user: userId
    });
    
    return presence.presence === 'active';
  } catch (error) {
    console.error('Erreur lors de la vérification de la présence :', error);
    return false;
  }
};
