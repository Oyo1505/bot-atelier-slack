import { app } from '../lib/slack-app.js';
import { sendQuestionToUsers } from './send-question-to-user.js';

export const commandSurvey = () => {
app.command('/survey', async ({ ack }) => {
  try {
    await ack();
    await sendQuestionToUsers();
  } catch (error) {
    console.log(error);
  }
})};