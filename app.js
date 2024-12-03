import { commandSurvey } from './actions/comand-survey.js';
import { app } from './lib/slack-app.js';
import { scheduledQuestionsToUsers } from './utils/questions/send-question-to-users/scheduled-question-to-users.js';

commandSurvey();
scheduledQuestionsToUsers();

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!', process.env.PORT || 3000 );
})();