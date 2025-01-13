import { app } from '../../lib/slack-app.js';
import { sendQuestionsToUsers } from '../questions/send_questions-to-users.js';
import { isAuthorizedUser } from '../../utils/bool/is-authorized-user.js';


export const commandSurvey = () => {
app.command('/survey', async ({ ack, body }) => {
  if(!isAuthorizedUser(body.user_id)) return
  try {
   await ack();
   const users = await app.client.users.list()
   const authorizedUser = users?.members?.filter(user => user.real_name === 'Henri-Pierre Rigoulet'  && !user.is_bot && user.is_email_confirmed && !user.deleted)[0];
   if (authorizedUser !== undefined) await sendQuestionsToUsers();
  } catch (error) {
    console.log(error);
  }
})};