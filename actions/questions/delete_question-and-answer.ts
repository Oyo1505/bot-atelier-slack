import { app } from '../../lib/slack-app.ts';

export const deleteQuestionAndAnswer = async ({channelId, messageTs }: { text : string, channelId: string, messageTs : string}) => {
  try {
    const messageDeleted =  await app.client.chat.delete({ channel: channelId, ts: messageTs });
    return messageDeleted.ok;
  } catch (error) {
    console.log(error, 'Erreur lors de la suppression de la question et de la réponse, deleteQuestionAndAnswer');
    return false;
  }
}