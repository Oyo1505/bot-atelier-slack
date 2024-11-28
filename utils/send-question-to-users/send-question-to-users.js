import { app } from '../../lib/slack-app.js';
import cron from 'node-cron';
import { questions } from "../random-question/random-question.js";
import { actionFromBlockButton } from '../../actions/action-from-block-button.js';
import { createSheetToGooleDrive } from '../create-sheet-to-google-drive/create-sheet-to-google-drive.js';
import { deleteAllFiles } from '../delete-all-files/delete-all-files.js';

const SECONDES = 0;
const MINUTES = 44;
const HOURS = 15;
const DAYS_OF_MONTH = '*';
const MONTHS = '*';
const DAYS_OF_WEEK = '*';

const SCHEDULE_TIME = `${SECONDES} ${MINUTES} ${HOURS} ${DAYS_OF_MONTH} ${MONTHS} ${DAYS_OF_WEEK}`;

export const scheduleMessageToUsers = async () => {
//await deleteAllFiles()
  cron.schedule(SCHEDULE_TIME, () => {

    app.client.users.list().then(async res => {
    const sheetId = await createSheetToGooleDrive();
      if(sheetId !== null){
        res.members.forEach((member) => {
          if (member.real_name === 'Henri-Pierre Rigoulet' || member.real_name === 'Sebastien Bortenlänger' && member.is_bot === false && member.is_email_confirmed === true && member.deleted === false) {
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
           actionFromBlockButton(block.action_id, res);
        });
      });
    })
    .catch(err => {
      console.error("Erreur lors de l'envoi du message :", err);
    })
  });
};