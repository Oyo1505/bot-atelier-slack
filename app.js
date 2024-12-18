import { commandSurvey } from './actions/comand_survey.js';
import { commandRapport } from './actions/command_rapport.js';
import { app } from './lib/slack-app.js';
import { scheduledQuestionsToUsersEachThursday } from './utils/questions/scheduled-question-to-users.js';
import  express from 'express';
import { scheduledQuestions } from './utils/questions/scheduled-questions.js';
import { isAuthorizedUser } from './utils/bool/is-authorized-user.js';

const appExpress = express();

appExpress.listen(process.env.PORT || 3000 ,()=> {console.log(process.env.PORT || 3000);})
app.command('/test', async ({ ack, body }) => {
  if(!isAuthorizedUser(body.user_id)) return
  try {
   await ack();
   app.client.chat.postMessage({
    channel: body.user_id,
    text: 'test',
  });
  } catch (error) {
    console.log(error);
  }
})
commandRapport();
commandSurvey();
scheduledQuestionsToUsersEachThursday();
scheduledQuestions();


(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!', process.env.PORT || 3000 );
})();