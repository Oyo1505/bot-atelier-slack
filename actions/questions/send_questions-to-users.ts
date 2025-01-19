import { app } from '../../lib/slack-app.ts';

import { questions } from "./random-question.ts";
import { openDirectMessage } from "../../utils/slack/open-direct-message-to-user.ts";
import { postBlocksQuestionAsUser } from "../buttons/post_message-as-user.ts";
import { actionFromBlockButton } from "../buttons/action-from-block-button.ts";
import { usersTeamProduit } from "../../shared/constants.js";
import { Block } from '@slack/web-api';
import { BlockButtonAction } from '@slack/bolt';

interface Question {
  question: string;
  blocks: Block[];
}
const sendNextQuestion = async ({
  client,
  channelId,
  currentBlockId,
}: {
  client: any;
  channelId: string;
  currentBlockId: string;
}) => {
  // Trouver l'index de la question actuelle
  const currentIndex = questions.findIndex((q) =>
    q.blocks.some((block) => block.block_id === currentBlockId),
  );

  // Déterminer la question suivante
  const nextQuestion = questions[currentIndex + 1];
  if (!nextQuestion) {
    console.log('Pas de question suivante à envoyer.');
    return;
  }

  // Envoyer la question suivante
  await client.chat.postMessage({
    channel: channelId,
    text: nextQuestion.question,
    blocks: nextQuestion.blocks,
  });
};
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

// Configurer une action pour chaque bouton
questions.forEach((question) => {
  question.blocks.forEach((block) => {
    if (block.type === 'actions' && block.elements) {
      block.elements.forEach((element: any) => {
        app.action(element.action_id, async ({ ack, body, client }: any) => {
          await ack();
          console.log(`Action ${element.action_id} reçue.,`, client);
          const channelId = body.container.channel_id;
          const currentBlockId = body.message.blocks[0].block_id;

          try {
            // Appeler la fonction pour envoyer la question suivante
            await sendNextQuestion({ client, channelId, currentBlockId });
            console.log(`Question suivante envoyée après le bouton ${element.action_id}.`);
          } catch (error) {
            console.error('Erreur lors de l’envoi de la question suivante:', error);
          }
        });
      });
    }
  });
});

  } catch (error) {
    console.error("Erreur générale dans sendQuestionsToUsers:", error);
  }
};

