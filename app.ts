
import { app } from './lib/slack-app.ts';
import { scheduledQuestionsToUsersEachThursday } from './actions/questions/scheduled-question-to-users-each-thursday.ts';
import  express from 'express';
import { scheduledQuestions } from './actions/questions/scheduled-questions.ts';
import { commandRapport } from './actions/commands/command_rapport.ts';
import { commandSurvey } from './actions/commands/comand_survey.ts';
import { actionFromBlockButton } from './actions/buttons/action-from-block-button.ts';
import { commandAgent } from './actions/commands/command_agent.ts';
import { getEmailsFromGmail } from './utils/gmail/get-email-user.ts';

const appExpress = express();

appExpress.listen(process.env.PORT_EXPRESS || 3000 ,()=> {console.log(process.env.PORT_EXPRESS || 8000);})

commandRapport();
commandSurvey();
scheduledQuestionsToUsersEachThursday();
scheduledQuestions();
commandAgent();
actionFromBlockButton();
getEmailsFromGmail();

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!', process.env.PORT || 3000 );
})();