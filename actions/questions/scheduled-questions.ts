import cron from 'node-cron';
import { sendQuestionsToUserOnline } from './send_questions-to-user-online.ts';
import { getTheLastSheetIdFromGoogleDrive } from '../../utils/google-drive/get-last-sheet-id.ts';
import { fetchUsersList } from '../../utils/slack/fetch-all-users.ts';


const SCHEDULE_CONFIG = {
  SECONDES: '0',
  MINUTES: '0', 
  HOURS: '9-12',
  DAYS_OF_MONTH: '*',
  MONTHS: '*',
  DAYS_OF_WEEK: '1-3'
};

const SCHEDULE_TIME = Object.values(SCHEDULE_CONFIG).join(' ');


export const scheduledQuestions = async () => {
 
  try {
    const users = await fetchUsersList();
    const sheetId = await getTheLastSheetIdFromGoogleDrive();
  
    if (!sheetId) {
      throw new Error('Impossible de récupérer la feuille Google Drive');
    }
    cron.schedule(SCHEDULE_TIME, async () => {

      sheetId &&  await sendQuestionsToUserOnline(users, sheetId)
  })
  }catch(err){
    console.error('Error dans scheduledQuestions')
  }
}