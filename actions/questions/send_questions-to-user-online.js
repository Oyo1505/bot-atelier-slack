import { app } from "../../lib/slack-app.js";
import { usersTeamProduit } from "../../shared/constants.js";
import { questions } from "./random-question.js";
import { openDirectMessage } from "../../utils/slack/open-direct-message-to-user.js";
import { actionFromBlockButton } from "../buttons/action-from-block-button.js";
import { checkUserPresence} from '../../utils/slack/check-user-presence.js'
import { checkIfUserAlreadyInSheet} from '../../utils/google-drive/check-if-user-already-in-sheet.js'
import { postBlocksQuestionAsUser } from "../buttons/post_message-as-user.js";

export const sendQuestionsToUserOnline = async (sheetId) => {
  app.client.users.list().then(async res => {
    for (const member of res.members) {
      try {
        if (usersTeamProduit.includes(member.real_name) && !member.is_bot && member.is_email_confirmed && !member.deleted) {

          const [userIsAlreadyInSheet, userIsOnline] = await Promise.all([
            checkIfUserAlreadyInSheet({ userId: member.id, sheetId }),
            checkUserPresence(member.id),
          ]);
     
          if (!userIsAlreadyInSheet && userIsOnline) {
            const firstQuestion = questions[0];
            const channelId = await openDirectMessage(member.id);
            await postBlocksQuestionAsUser({
              channelId,
              userId: member.id,
              blocks: firstQuestion.blocks,
            });
          }
        }
      } catch (error) {
        console.error(`Erreur pour l'utilisateur ${member.id} :`, error);
      }
    }
      return sheetId
    }).then(async (res) => {
      questions.map(({ blocks })=>{
        blocks[1].elements?.map(async (block) => {
          await  actionFromBlockButton({idButton: block.action_id, sheetId: res, blockId: blocks[0].block_id});
        });
      });
    })
    .catch(err => {
      console.error("Erreur lors de l'envoi du message :", err);
    })
}