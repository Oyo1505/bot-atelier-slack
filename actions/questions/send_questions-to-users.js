import { app } from "../../lib/slack-app.js";
import { createSheetToGooleDrive } from "../../utils/google-drive/create-sheet-to-google-drive.js";
import { questions } from "./random-question.js";
import { openDirectMessage } from "../../utils/slack/open-direct-message-to-user.js";
import { postBlocksQuestionAsUser } from "../buttons/post_message-as-user.js";
import { actionFromBlockButton } from "../buttons/action-from-block-button.js";
import { usersTeamProduit } from "../../shared/constants.js";

export const sendQuestionsToUsers = async () => {
  app.client.users.list().then(async res => {
    const sheetId = await createSheetToGooleDrive();
      if(sheetId !== null){
        res.members.forEach(async (member) => {
          if(usersTeamProduit.includes(member.real_name) && !member.is_bot && member.is_email_confirmed && !member.deleted) {
            const firstQuestion = questions[0];
             app.client.chat.postMessage({
              channel: member.id,
              text: firstQuestion.question,
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
        blocks[1].elements?.map(async (block) => {
          await actionFromBlockButton({idButton: block.action_id, sheetId: res, blockId: blocks[0].block_id});
        });
      });
    })
    .catch(err => {
      console.error("Erreur lors de l'envoi du message :", err);
    })
};
