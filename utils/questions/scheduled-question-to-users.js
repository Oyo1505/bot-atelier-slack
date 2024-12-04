import cron from 'node-cron';
import { sendQuestionToUsers } from '../../actions/send-question-to-user.js';
import { deleteAllFiles } from '../google-drive/delete-all-files.js'


const SECONDES = 0;
const MINUTES = 0;
const HOURS = 12;
const DAYS_OF_MONTH = '*';
const MONTHS = '*';
const DAYS_OF_WEEK = 5;

const SCHEDULE_TIME = `${SECONDES} ${MINUTES} ${HOURS} ${DAYS_OF_MONTH} ${MONTHS} ${DAYS_OF_WEEK}`;


export const scheduledQuestionsToUsers = async () => {
 await deleteAllFiles()
  cron.schedule(SCHEDULE_TIME, () => {
    sendQuestionToUsers();
  });
};