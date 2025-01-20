import { app } from "../../lib/slack-app";
import { questions } from "./random-question";

export const sendNextQuestion = async ({
  channelId,
  currentBlockId,
  userId
}: {
  channelId: string;
  currentBlockId: string;
  userId: string;
}) => {
  const currentIndex = questions.findIndex((q) =>
    q.blocks.some((block) => block.block_id === currentBlockId),
  );

  const nextQuestion = questions[currentIndex + 1];
  if (!nextQuestion) {
    await app.client.chat.postMessage({
      channel: channelId,
      text: `Merci <@${userId}> d'avoir répondu à toutes les questions ! 🎉`,
    });
    return;
  }

  // Envoyer la question suivante
  await app.client.chat.postMessage({
    channel: channelId,
    text: nextQuestion.question,
    blocks: nextQuestion.blocks,
  });
};