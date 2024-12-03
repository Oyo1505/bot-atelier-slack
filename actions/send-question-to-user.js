import { app } from "../lib/slack-app.js";
import { createSheetToGooleDrive } from "../utils/google-drive/create-sheet-to-google-drive/create-sheet-to-google-drive.js";
import { questions } from "../utils/questions/random-question/random-question.js";
import { actionFromBlockButton } from "./action-from-block-button.js";
import { postBlocksQuestionAsUser } from "./post-message-as-user.js";

const openDirectMessage = async (userId) => {
  try {
    const result = await app.client.conversations.open({
      users: userId, // ID de l'utilisateur cible
    });
    return result.channel.id; // Retourne l'ID du canal DM
  } catch (error) {
    console.error('Erreur lors de l’ouverture de la conversation directe :', error);
    throw error;
  }
};

const usersTeamProduit = ['Louise Rocheteau', 'Bruno Griveau', 'François Pagnon', 'Diogo De Araujo', 'Charles Goddet', 'Stan Husson'];
//const usersTeamProduit = ['Henri-Pierre Rigoulet'];
export const sendQuestionToUsers = async () => {
  app.client.users.list().then(async res => {
    const sheetId = await createSheetToGooleDrive();
      if(sheetId !== null){
        res.members.forEach(async (member) => {
          if (usersTeamProduit.includes(member.real_name) && member.is_bot === false && member.is_email_confirmed === true && member.deleted === false) {
            const firstQuestion = questions[0];
             app.client.chat.postMessage({
              channel: member.id,
              text: questions[0].question,
            });
            const channelId = await openDirectMessage(member.id);
            await postBlocksQuestionAsUser({ channelId, userId: member.id, blocks: firstQuestion.blocks });
          }
        });
      return sheetId
      }
    }).then(async (res) => {
      console.log("Messages envoyés avec succès");
      questions.map(({ blocks })=>{
        blocks[1].elements?.map((block) => {
           actionFromBlockButton({idButton: block.action_id, sheetId: res, blockId: blocks[0].block_id});
        });
      });
    })
    .catch(err => {
      console.error("Erreur lors de l'envoi du message :", err);
    })
};
