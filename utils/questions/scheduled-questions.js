import cron from 'node-cron';
import { sendQuestionsToUserOnline } from '../../actions/send-questions-to-user-online.js';
import { getTheLastSheetFromGoogleDrive } from '../google-drive/get-the-last-sheet-from-google-drive.js';
import { checkIfUserAlreadyInSheet } from '../google-drive/check-if-user-already-in-sheet.js';
import { usersTeamProduit } from '../../shared/constants.js';
import { app } from '../../lib/slack-app.js';
import { checkUserPresence } from '../slack/check-user-presence.js';


const SECONDES = '*';
const MINUTES = '*';
const HOURS = 1;
const DAYS_OF_MONTH = '*';
const MONTHS = '*';
const DAYS_OF_WEEK = '*';

const SCHEDULE_TIME = `${SECONDES} ${MINUTES} ${HOURS} ${DAYS_OF_MONTH} ${MONTHS} ${DAYS_OF_WEEK}`;


export const scheduledQuestions = async () => {
  
  cron.schedule(SCHEDULE_TIME, async () => {
    try {
      const users = await app.client.users.list()
      users.members.forEach(async (user) => {
        if(usersTeamProduit.includes(user.real_name) && user.is_bot === false && user.is_email_confirmed === true && user.deleted === false){
          const sheet = await getTheLastSheetFromGoogleDrive()
          const userIsAlreadyInSheet = await checkIfUserAlreadyInSheet({userId: user.id, sheetId: sheet.id})
          
          if(!userIsAlreadyInSheet && await checkUserPresence(user.id)){
            await sendQuestionsToUserOnline(user.id, sheet.id);
          }
        }
      })
     
    }catch(err){
      console.error('Erreur lors de l\'envoi des questions :', err);
    }
  });
};