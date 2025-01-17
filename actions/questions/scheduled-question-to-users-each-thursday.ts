import cron from 'node-cron';
import { sendQuestionsToUsers } from './send_questions-to-users.ts';
import { fetchUsersList } from '../../utils/slack/fetch-all-users.ts';
import { deleteAllFiles } from '../../utils/google-drive/delete-all-files.ts'
import { createSheetToGooleDrive } from '../../utils/google-drive/create-sheet-to-google-drive.ts';

const SCHEDULE_CONFIG = {
  SECONDES: '*',
  MINUTES: '*',
  HOURS: '1',
  DAYS_OF_MONTH: '*', 
  MONTHS: '*',
  DAYS_OF_WEEK: '*' // Jeudi
};

const SCHEDULE_TIME = Object.values(SCHEDULE_CONFIG).join(' ');

export const scheduledQuestionsToUsersEachThursday = async () => {
  const users = await fetchUsersList();
  
 await deleteAllFiles()
  cron.schedule(SCHEDULE_TIME, async () => {
    const sheetId = await createSheetToGooleDrive();
    await sendQuestionsToUsers(users, sheetId);
  });
};