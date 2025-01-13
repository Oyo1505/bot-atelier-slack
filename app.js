
import { app } from './lib/slack-app.js';
import { scheduledQuestionsToUsersEachThursday } from './actions/questions/scheduled-question-to-users-each-thursday.js';
import  express from 'express';
import { scheduledQuestions } from './actions/questions/scheduled-questions.js';
import { commandRapport } from './actions/commands/command_rapport.js';
import { commandSurvey } from './actions/commands/comand_survey.js';

const appExpress = express();

appExpress.listen(process.env.PORT || 3000 ,()=> {console.log(process.env.PORT || 3000);})

commandRapport();
commandSurvey();
scheduledQuestionsToUsersEachThursday();
scheduledQuestions();

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!', process.env.PORT || 3000 );
})();