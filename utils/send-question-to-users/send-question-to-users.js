import { app } from '../../lib/slack-app.js';
import cron from 'node-cron';
import { randomQuestion } from "../random-question/random-question.js";
import { actionFromBlockButton } from '../../actions/action-from-block-button.js';

const SECONDES = 0;
const MINUTES = 34;
const HOURS = 11;
const DAYS_OF_WEEK = '*';


const SCHEDULE_WEEKLY = `${SECONDES} ${MINUTES} ${HOURS} * * ${DAYS_OF_WEEK}`;

export const scheduleMessageToUsers =  () => {

  const question = randomQuestion().question;
  const blocks = randomQuestion().blocks;
  const elementsBlocks = blocks[1].elements;

  cron.schedule(SCHEDULE_WEEKLY, () => {
    app.client.users.list().then(async res => {
      res.members.forEach( async (member) => {
        if (member.real_name === 'Henri-Pierre Rigoulet' && member.is_bot === false && member.is_email_confirmed === true && member.deleted === false) {
           await app.client.chat.postMessage({
            channel: member.id,
            text: `Salut <@${member.id}>! ${question}?`,
            blocks: blocks,
          });
        }
      });
    }).catch(err => {
      console.error("Erreur lors de l'envoi du message :", err);
    }).finally(()=>{
      console.log("Messages envoyés avec succès");
      elementsBlocks?.map((block, index) => {
        actionFromBlockButton(block.action_id, index + 1);
      });
    } );
  });
};
