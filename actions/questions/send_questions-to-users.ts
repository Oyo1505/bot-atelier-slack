import { app } from '../../lib/slack-app.ts';
import { questions } from "./random-question.ts";
import { openDirectMessage } from "../../utils/slack/open-direct-message-to-user.ts";
import { usersTeamProduit } from "../../shared/constants.js";
import { Block } from '@slack/web-api';
import { UserListResult, Users } from '../../model/user.ts';


interface Question {
  question: string;
  blocks: Block[];
}

export const sendQuestionsToUsers = async (users: UserListResult, sheetId: string) => {

  try {
    if (!sheetId) {
      console.error("Sheet ID manquant. Annulation de l'envoi.");
      return;
    }

    if (!users.members) {
      console.error("Aucun membre trouvé. Annulation de l'envoi.");
      return;
    }

    for (const member of users.members) {
      try {
        if (
          member.id &&
          member.real_name &&
          usersTeamProduit.includes(member.real_name) &&
          !member.is_bot &&
          member.is_email_confirmed &&
          !member.deleted
        ) {
          const firstQuestion: Question = questions[0];
          const channelId = await openDirectMessage(member.id);
     
          await app.client.chat.postMessage({
            channel: channelId,
            text: firstQuestion.question,
            blocks: firstQuestion.blocks,
          });

        }
      } catch (error) {
        console.error(`Erreur lors de l'envoi à l'utilisateur ${member.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Erreur générale dans sendQuestionsToUsers:", error);
  }
};

