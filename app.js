import { commandSurvey } from './actions/comand_survey.js';
import { commandRapport } from './actions/command_rapport.js';
import { app } from './lib/slack-app.js';
import { scheduledQuestionsToUsers } from './utils/questions/scheduled-question-to-users.js';
import  express from 'express';

const appExpress = express();

appExpress.listen(process.env.PORT || 3000 ,()=> {console.log(process.env.PORT || 3000);})
commandRapport();
commandSurvey();
scheduledQuestionsToUsers();

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!', process.env.PORT || 7000 );
})();