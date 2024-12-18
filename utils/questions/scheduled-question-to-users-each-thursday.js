import cron from 'node-cron';
import { sendQuestionsToUsers } from '../../actions/send-questions-to-users.js';
//import { deleteAllFiles } from '../google-drive/delete-all-files.js'
const SCHEDULE_CONFIG = {
  SECONDES: '0',
  MINUTES: '0',
  HOURS: '12',
  DAYS_OF_MONTH: '*', 
  MONTHS: '*',
  DAYS_OF_WEEK: '4' // Jeudi
};

const SCHEDULE_TIME = Object.values(SCHEDULE_CONFIG).join(' ');

export const scheduledQuestionsToUsersEachThursday = async () => {
 //await deleteAllFiles()
  cron.schedule(SCHEDULE_TIME, async () => {
    await sendQuestionsToUsers();
  });
};