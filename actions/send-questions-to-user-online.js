import { app } from "../lib/slack-app.js";
import { questions } from "../utils/questions/random-question.js";
import { openDirectMessage } from "../utils/slack/open-direct-message-to-user.js";
import { actionFromBlockButton } from "./action-from-block-button.js";
import { postBlocksQuestionAsUser } from "./post-message-as-user.js";

export const sendQuestionsToUserOnline = async (userId, sheetId) => {
  try {
    const firstQuestion = questions[0];
    app.client.chat.postMessage({
      channel: userId,
      text: questions[0].question,
    });
    const channelId = await openDirectMessage(userId);
    await postBlocksQuestionAsUser({ channelId, userId, blocks: firstQuestion.blocks });
    questions.map(({ blocks })=>{
      blocks[1].elements?.map(async (block) => {
        await actionFromBlockButton({idButton: block.action_id, sheetId, blockId: blocks[0].block_id});
      });
    });
  } catch (error) {
    console.error('Erreur lors de l’envoi du message :', error);
    throw error;
  }
}