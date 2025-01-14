import { app } from '../../lib/slack-app.ts';
import { createSheetToGooleDrive } from "../../utils/google-drive/create-sheet-to-google-drive.ts";
import { questions } from "./random-question.ts";
import { openDirectMessage } from "../../utils/slack/open-direct-message-to-user.ts";
import { postBlocksQuestionAsUser } from "../buttons/post_message-as-user.ts";
import { actionFromBlockButton } from "../buttons/action-from-block-button.ts";
import { usersTeamProduit } from "../../shared/constants.js";

interface Member {
  id?: string;
  real_name: string;
  is_bot: boolean;
  is_email_confirmed: boolean;
  deleted: boolean;
}

interface Question {
  question: string;
  blocks: Block[];
}

interface Block {
  action_id?: string;
  block_id: string;
  elements?: Element[];
  type: 'section' | 'divider' | 'image' | 'actions' | 'context' | 'input' | 'rich_text';
}

interface Element {
  action_id: string;
}


export const sendQuestionsToUsers = async () => {
  app.client?.users?.list({}).then(async res => {
    const sheetId = await createSheetToGooleDrive();
      if(sheetId !== null){
   
        res?.members?.forEach(async (member: Member) => {
          if (usersTeamProduit.includes(member.real_name) && !member.is_bot && member.is_email_confirmed && !member.deleted) {
            const firstQuestion: Question = questions[0];
            await app.client.chat.postMessage({
              channel: member?.id!,
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
