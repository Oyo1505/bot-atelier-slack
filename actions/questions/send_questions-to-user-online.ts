import { usersTeamProduit } from "../../shared/constants.js";
import { questions } from "./random-question.ts";
import { openDirectMessage } from "../../utils/slack/open-direct-message-to-user.ts";
import { checkUserPresence} from '../../utils/slack/check-user-presence.ts'
import { checkIfUserAlreadyInSheet} from '../../utils/google-drive/check-if-user-already-in-sheet.ts'
import { app } from "../../lib/slack-app.ts";
import { Users } from "../../model/user.ts";

export const sendQuestionsToUserOnline = async (users:Users, sheetId: string) => {
    for (const member of users?.members) {
      try {
        if (member.id &&  member.real_name && usersTeamProduit.includes(member.real_name) && !member.is_bot && member.is_email_confirmed && !member.deleted) {

          const [userIsAlreadyInSheet, userIsOnline] = await Promise.all([
            checkIfUserAlreadyInSheet({ userId: member.id, sheetId }),
            checkUserPresence(member?.id),
          ]);
     
          if (!userIsAlreadyInSheet && userIsOnline) {
            const firstQuestion = questions[0];
            const channelId = member.id &&  await openDirectMessage(member.id);
            await app.client.chat.postMessage({
              channel: channelId,
              text: firstQuestion.question,
              blocks: firstQuestion.blocks,
            });
          }
        }
      } catch (error) {
        console.error(`Erreur pour l'utilisateur ${member.id} :`, error);
      }
    }
}