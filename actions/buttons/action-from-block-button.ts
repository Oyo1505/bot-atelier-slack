import { app } from '../../lib/slack-app.ts';
import { SlackActionMiddlewareArgs, BlockButtonAction } from '@slack/bolt';
import { checkIfUserCanReplyToTheSurvey } from '../../utils/google-drive/check-if-user-can-reply-to-survey.ts';
import { checkIfUserAlreadyResponded } from '../../utils/google-drive/check-user-already-responded.ts';
import { deleteQuestionAndAnswer } from '../questions/delete_question-and-answer.ts';
import { appendToGoogleSheets } from '../../utils/google-drive/send-file-to-google-drive.ts';
import { postMessageAsUser } from '../../utils/slack/post-message-as-user.ts';
import { getTheLastSheetIdFromGoogleDrive } from '../../utils/google-drive/get-last-sheet-id.ts';
import { sendNextQuestion } from '../questions/sendNextQuestion.ts';


export const actionFromBlockButton = async () => {
  app.action(/^reponse_/, async ({ ack, body }: SlackActionMiddlewareArgs<BlockButtonAction>) => {
    
   await ack();
     const channelId = body.container.channel_id;
     const currentBlockId = body?.message?.blocks[0].block_id;
     const sheetId = await getTheLastSheetIdFromGoogleDrive() ?? '';
     const actionId = body.actions[0].action_id;
     const textAction = body.actions[0].text.text;
     const userId = body.user.id;
     const messageTs = body.container.message_ts;
     const userName = body.user.name;

     try {
       const canReply = await checkIfUserCanReplyToTheSurvey({sheetId, messageTs, userId, blockId:currentBlockId});
       if(!canReply) return
       const isAlreadyResponded = await checkIfUserAlreadyResponded({ userId, sheetId, blockId:currentBlockId });
       await deleteQuestionAndAnswer({ text: textAction, channelId, messageTs });
       await postMessageAsUser({ text:textAction,channelId, userId })
       if(!isAlreadyResponded) {
         await appendToGoogleSheets({ userId, userName, answerText: textAction, answerId: actionId, sheetId, blockId:currentBlockId, messageTs:messageTs });
         await sendNextQuestion({channelId, currentBlockId, userId });
       }
   } catch (error) {
        console.error("Erreur lors du traitement de l'action :", error);
      }
  });
};

