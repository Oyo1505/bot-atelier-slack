import cron from 'node-cron';
import { getTheLastSheetFromGoogleDrive } from '../../utils/google-drive/get-the-last-sheet-from-google-drive.ts';
import { sendQuestionsToUserOnline } from './send_questions-to-user-online.ts';


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
    const sheet = await getTheLastSheetFromGoogleDrive();
    if (!sheet) {
      throw new Error('Impossible de récupérer la feuille Google Drive');
    }
    cron.schedule(SCHEDULE_TIME, async () => {
      sheet?.id &&  await sendQuestionsToUserOnline(sheet?.id)
  })
  }catch(err){
    console.error('Error dans scheduledQuestions')
  }
}