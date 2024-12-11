import { app } from '../lib/slack-app.js';
import { isAuthorizedUser } from '../utils/bool/is-authorized-user.js';
import { sendQuestionToUsers } from './send-question-to-user.js';

export const commandSurvey = () => {
app.command('/survey', async ({ ack, body }) => {
  if(!isAuthorizedUser(body.user_id)) return
  try {
   await ack();
   const users = await app.client.users.list()
   const authorizedUser = users?.members?.filter(user => user.real_name === 'Henri-Pierre Rigoulet'  && user.is_bot === false && user.is_email_confirmed === true && user.deleted === false)[0];
   if (authorizedUser !== undefined) await sendQuestionToUsers();
  } catch (error) {
    console.log(error);
  }
})};