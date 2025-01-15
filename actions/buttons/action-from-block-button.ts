import { app } from '../../lib/slack-app.ts';
import { SlackActionMiddlewareArgs, BlockButtonAction } from '@slack/bolt';
import { questions } from '../questions/random-question.ts';
import { postAnswerOnThread } from './post_answer-on-thread.ts';
import { checkIfUserCanReplyToTheSurvey } from '../../utils/google-drive/check-if-user-can-reply-to-survey.ts';
import { checkIfUserAlreadyResponded } from '../../utils/google-drive/check-user-already-responded.ts';
import { deleteQuestionAndAnswer } from '../questions/delete_question-and-answer.ts';
import { postBlocksQuestionAsUser } from './post_message-as-user.ts';
import { appendToGoogleSheets } from '../../utils/google-drive/send-file-to-google-drive.ts';

type Button = {
  idButton: string;
  sheetId: string;
  blockId: string;
};

// Fonction pour supprimer la question et la réponse associée.
const handleDeleteQuestionAndAnswer = async ({ text, channelId, messageTs, userId }: { text:string, channelId:string, messageTs:string, userId:string }) => {
  try {
    await deleteQuestionAndAnswer({ text, channelId, messageTs, userId });
  } catch (error) {
    console.error("Erreur lors de la suppression de la question et de la réponse:", error);
  }
};

// Fonction pour gérer la réponse de l'utilisateur et la soumettre au Google Sheets.
const handleUserAnswer = async ({ textAction, actionId, userId, sheetId, blockId, messageTs, userName }:{textAction:string, actionId:string, userId:string, sheetId:string, blockId:string, messageTs:number, userName:string }) => {
  try {
    const isAddedToSheet = await appendToGoogleSheets({
      userId, userName, answerText: textAction, answerId: actionId, sheetId, blockId, messageTs
    });
    
    return isAddedToSheet;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réponse aux Google Sheets:", error);
  }
};

// Fonction pour passer à la question suivante.
const handleNextQuestion = async ({ channelId, userId, blockId }: {channelId:string, userId:string, blockId:string}) => {
  const currentQuestionIndex = questions.findIndex(q => q.blocks[0].block_id === blockId);
  const nextQuestion = questions[currentQuestionIndex + 1];
  
  if (nextQuestion) {
    await app.client.chat.postMessage({
      channel: channelId,
      text: `${nextQuestion.question}`,
    });
    await postBlocksQuestionAsUser({ channelId, userId, blocks: nextQuestion.blocks });
  } else {
    await app.client.chat.postMessage({
      channel: channelId,
      text: `Merci <@${userId}> d'avoir répondu à toutes les questions ! 🎉`,
    });
  }
};

// Fonction principale qui gère l'action du bouton.
export const actionFromBlockButton = async ({ idButton, sheetId, blockId }: Button) => {
  app.action(idButton, async ({ ack, body }: SlackActionMiddlewareArgs<BlockButtonAction>) => {
    const actionId = body.actions[0].action_id;
    const textAction = body.actions[0].text.text;
    const userId = body.user.id;
    const channelId = body.container.channel_id;
    const messageTs = body.container.message_ts;
    const userName = body.user.name ?? '';

    try {
      await ack();

      // Suppression de la question et de la réponse
      await handleDeleteQuestionAndAnswer({ text: textAction, channelId, messageTs, userId });

      // Vérification si l'utilisateur peut répondre
      const canReply = await checkIfUserCanReplyToTheSurvey({ sheetId, messageTs, userId, blockId });
      if (!canReply) return;

      // Vérification si l'utilisateur a déjà répondu
      const isAlreadyResponded = await checkIfUserAlreadyResponded({ userId, sheetId, blockId });
      if (isAlreadyResponded) {
        await postAnswerOnThread({ channelId, messageTs, textAction: 'Tu as déjà répondu à cette question.' });
        return;
      }

      // Traitement de la réponse de l'utilisateur
      const isAddedToSheet = await handleUserAnswer({ textAction, actionId, userId, sheetId, blockId, messageTs, userName });
      if (isAddedToSheet) {
        // Passage à la question suivante si disponible
        await handleNextQuestion({ channelId, userId, blockId });
      }
    } catch (error) {
      console.error("Erreur lors du traitement de l'action :", error);
    }
  });
};
