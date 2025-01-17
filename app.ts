
import { app } from './lib/slack-app.ts';
import { scheduledQuestionsToUsersEachThursday } from './actions/questions/scheduled-question-to-users-each-thursday.ts';
import  express from 'express';
import { scheduledQuestions } from './actions/questions/scheduled-questions.ts';
import { commandRapport } from './actions/commands/command_rapport.ts';
import { commandSurvey } from './actions/commands/comand_survey.ts';

const appExpress = express();

appExpress.listen(process.env.PORT || 3000 ,()=> {console.log(process.env.PORT || 3000);})

commandRapport();
commandSurvey();
scheduledQuestionsToUsersEachThursday();
//scheduledQuestions();

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!', process.env.PORT || 3000 );
})();