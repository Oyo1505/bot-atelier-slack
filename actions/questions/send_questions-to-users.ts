import { app } from '../../lib/slack-app.ts';
import { createSheetToGooleDrive } from "../../utils/google-drive/create-sheet-to-google-drive.ts";
import { questions } from "./random-question.ts";
import { openDirectMessage } from "../../utils/slack/open-direct-message-to-user.ts";
import { postBlocksQuestionAsUser } from "../buttons/post_message-as-user.ts";
import { actionFromBlockButton } from "../buttons/action-from-block-button.ts";
import { usersTeamProduit } from "../../shared/constants.js";
import { Block } from '@slack/web-api';
import { Member } from '@slack/web-api/dist/types/response/UsersListResponse';

interface Question {
  question: string;
  blocks: Block[];
}


export const sendQuestionsToUsers = async () => {
  app.client?.users?.list({}).then(async res => {
    const sheetId = await createSheetToGooleDrive();
      if(sheetId !== null){
   
        res?.members?.forEach(async (member: Member) => {
          if (member.id && member.real_name && usersTeamProduit.includes(member.real_name) && !member.is_bot && member.is_email_confirmed && !member.deleted) {
            const firstQuestion: Question = questions[0];
            await app.client.chat.postMessage({
              channel: member.id,
              text: firstQuestion.question,
            });
            const channelId = await openDirectMessage(member.id!);
            await postBlocksQuestionAsUser({ channelId, userId: member.id!, blocks: firstQuestion.blocks });
          }
        });
      return sheetId
      }
    }).then(async (res) => {
      console.log("Messages envoyés avec succès");
      questions.map(({ blocks })=>{
        blocks[1].elements?.map(async (block) => {
          if (block.action_id && blocks[0].block_id && res) {
            await actionFromBlockButton({idButton: block.action_id, sheetId: res, blockId: blocks[0].block_id});
          }
        });
      });
    })
    .catch(err => {
      console.error("Erreur lors de l'envoi du message :", err);
    })
};
