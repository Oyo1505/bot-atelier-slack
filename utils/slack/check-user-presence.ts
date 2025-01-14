import { app } from "../../lib/slack-app.ts";

export const checkUserPresence = async (userId:string) => {
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
