import { app } from '../../lib/slack-app.ts';

import { questions } from "./random-question.ts";
import { openDirectMessage } from "../../utils/slack/open-direct-message-to-user.ts";
import { postBlocksQuestionAsUser } from "../buttons/post_message-as-user.ts";
import { actionFromBlockButton } from "../buttons/action-from-block-button.ts";
import { usersTeamProduit } from "../../shared/constants.js";
import { Block } from '@slack/web-api';

interface Question {
  question: string;
  blocks: Block[];
}

export const sendQuestionsToUsers = async (users: any, sheetId: string) => {
  try {
    if (!sheetId) {
      console.error("Sheet ID manquant. Annulation de l'envoi.");
      return;
    }

    // Boucle pour chaque utilisateur
    for (const member of users.members) {
      try {
        // Vérifications pour s'assurer que l'utilisateur est valide
        if (
          member.id &&
          member.real_name &&
          usersTeamProduit.includes(member.real_name) &&
          !member.is_bot &&
          member.is_email_confirmed &&
          !member.deleted
        ) {
          // Envoyer la première question à l'utilisateur
          const firstQuestion: Question = questions[0];
          await app.client.chat.postMessage({
            channel: member.id,
            text: firstQuestion.question,
          });

          // Ouvrir un canal de message direct
          const channelId = await openDirectMessage(member.id);

          // Envoyer les blocs de la première question
          await postBlocksQuestionAsUser({
            channelId,
            userId: member.id,
            blocks: firstQuestion.blocks,
          });
        }
      } catch (error) {
        console.error(`Erreur lors de l'envoi à l'utilisateur ${member.id}:`, error);
      }
    }

    console.log("Messages envoyés avec succès aux utilisateurs valides.");

    // Configuration des actions des boutons
    for (const { blocks } of questions) {
      try {
        if (blocks && blocks.length > 1) {
          const elements = blocks[1].elements || [];
          for (const block of elements) {
            try {
              if (block.action_id && blocks[0].block_id && sheetId) {

                // Configurer l'action pour ce bouton
                await actionFromBlockButton({
                  actionId: block.action_id,
                  sheetId,
                  blockId: blocks[0].block_id,
                });
              }
            } catch (error) {
              console.error(`Erreur lors de la configuration du bouton ${block.action_id}:`, error);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la configuration des actions des blocs:", error);
      }
    }
  } catch (error) {
    console.error("Erreur générale dans sendQuestionsToUsers:", error);
  }
};

