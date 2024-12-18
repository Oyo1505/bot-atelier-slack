import cron from 'node-cron';
import { sendQuestionsToUserOnline } from '../../actions/send-questions-to-user-online.js';
import { getTheLastSheetFromGoogleDrive } from '../google-drive/get-the-last-sheet-from-google-drive.js';


const SCHEDULE_CONFIG = {
  SECONDES: '10',
  MINUTES: '*', 
  HOURS: '*',
  DAYS_OF_MONTH: '*',
  MONTHS: '*',
  DAYS_OF_WEEK: '1-3'
};

const SCHEDULE_TIME = Object.values(SCHEDULE_CONFIG).join(' ');

export const scheduledQuestions = async () => {
  try {
    const sheet = await getTheLastSheetFromGoogleDrive();
    if (!sheet) {
      throw new Error('Impossible de récupérer la feuille Google Drive');
    }
    cron.schedule(SCHEDULE_TIME, async () => {
      await sendQuestionsToUserOnline(sheet?.id)
  })
  }catch(err){
    console.error('Impossible de récupérer la feuille Google Drive')
  }
}