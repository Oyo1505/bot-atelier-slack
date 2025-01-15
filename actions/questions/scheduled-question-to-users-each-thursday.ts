import cron from 'node-cron';
import { sendQuestionsToUsers } from './send_questions-to-users.ts';
//import { deleteAllFiles } from '../../utils/google-drive/delete-all-files.ts'

const SCHEDULE_CONFIG = {
  SECONDES: '0',
  MINUTES: '40',
  HOURS: '10',
  DAYS_OF_MONTH: '*', 
  MONTHS: '*',
  DAYS_OF_WEEK: '3' // Jeudi
};

const SCHEDULE_TIME = Object.values(SCHEDULE_CONFIG).join(' ');

export const scheduledQuestionsToUsersEachThursday = async () => {
 //await deleteAllFiles()
  cron.schedule(SCHEDULE_TIME, async () => {
    await sendQuestionsToUsers();
  });
};