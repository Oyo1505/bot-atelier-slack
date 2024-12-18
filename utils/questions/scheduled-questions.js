import cron from 'node-cron';
import { sendQuestionsToUserOnline } from '../../actions/send-questions-to-user-online.js';
import { getTheLastSheetFromGoogleDrive } from '../google-drive/get-the-last-sheet-from-google-drive.js';
import { checkIfUserAlreadyInSheet } from '../google-drive/check-if-user-already-in-sheet.js';
import { usersTeamProduit } from '../../shared/constants.js';
import { app } from '../../lib/slack-app.js';
import { checkUserPresence } from '../slack/check-user-presence.js';
import { questions } from './random-question.js';
import { actionFromBlockButton } from '../../actions/action-from-block-button.js';
import { openDirectMessage } from '../slack/open-direct-message-to-user.js';
import { postBlocksQuestionAsUser } from '../../actions/post-message-as-user.js';


const SECONDES = '0';
const MINUTES = '5';
const HOURS = '9-12';
const DAYS_OF_MONTH = '*';
const MONTHS = '*';
const DAYS_OF_WEEK = '1-3';

const SCHEDULE_TIME = `${SECONDES} ${MINUTES} ${HOURS} ${DAYS_OF_MONTH} ${MONTHS} ${DAYS_OF_WEEK}`;


export const scheduledQuestions = async () => {
  const sheet = await getTheLastSheetFromGoogleDrive()
  cron.schedule(SCHEDULE_TIME, async () => {
    app.client.users.list().then(async res => {
        res.members.forEach(async (member) => {
            if (usersTeamProduit.includes(member.real_name) && member.is_bot === false && member.is_email_confirmed === true && member.deleted === false) {
              const userIsAlreadyInSheet = await checkIfUserAlreadyInSheet({userId: member.id, sheetId: sheet.id});
              const userIsOnline = await checkUserPresence(member.id);
              
              if(!userIsAlreadyInSheet && userIsOnline){
                const firstQuestion = questions[0];
                app.client.chat.postMessage({
                  channel: member.id,
                  text: questions[0].question,
                });
                const channelId = await openDirectMessage(member.id);
                await postBlocksQuestionAsUser({ channelId, userId: member.id, blocks: firstQuestion.blocks });
              }
            }
        });
        return sheet.id
      }).then(async (res) => {

        questions.map(({ blocks })=>{
          blocks[1].elements?.map(async (block) => {
            await  actionFromBlockButton({idButton: block.action_id, sheetId: res, blockId: blocks[0].block_id});
          });
        });
      })
      .catch(err => {
        console.error("Erreur lors de l'envoi du message :", err);
      })
  })
}