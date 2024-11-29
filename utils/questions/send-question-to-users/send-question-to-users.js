import cron from 'node-cron';
import { app } from '../../../lib/slack-app.js';
//import { deleteAllFiles } from '../../google-drive/delete-all-files/delete-all-files.js';
import { createSheetToGooleDrive } from '../../google-drive/create-sheet-to-google-drive/create-sheet-to-google-drive.js';
import { actionFromBlockButton } from '../../../actions/action-from-block-button.js';
import { questions } from '../random-question/random-question.js';

const SECONDES = 0;
const MINUTES = 33;
const HOURS = 16;
const DAYS_OF_MONTH = '*';
const MONTHS = '*';
const DAYS_OF_WEEK = '*';

const SCHEDULE_TIME = `${SECONDES} ${MINUTES} ${HOURS} ${DAYS_OF_MONTH} ${MONTHS} ${DAYS_OF_WEEK}`;

export const scheduleMessageToUsers = async () => {
// await deleteAllFiles()
  cron.schedule(SCHEDULE_TIME, () => {

    app.client.users.list().then(async res => {
    const sheetId = await createSheetToGooleDrive();
      if(sheetId !== null){
        res.members.forEach((member) => {
          if (member.real_name === 'Henri-Pierre Rigoulet' && member.is_bot === false && member.is_email_confirmed === true && member.deleted === false) {
            const firstQuestion = questions[0];
             app.client.chat.postMessage({
              channel: member.id,
              text: `Salut <@${member.id}>! Voici ta première question : ${firstQuestion.question}`,
              blocks: firstQuestion.blocks,
            });
          }
        });
      return sheetId
      }
    }).then(async (res) => {
      console.log("Messages envoyés avec succès");
      questions.map(({ blocks })=>{
        blocks[1].elements?.map((block) => {
           actionFromBlockButton({idButton: block.action_id, sheetId: res, scheduleTime: SCHEDULE_TIME});
        });
      });
    })
    .catch(err => {
      console.error("Erreur lors de l'envoi du message :", err);
    })
  });
};