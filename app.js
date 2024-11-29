import { app } from './lib/slack-app.js';
import { scheduleMessageToUsers } from './utils/questions/send-question-to-users/send-question-to-users.js';


scheduleMessageToUsers();

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!', process.env.PORT || 3000 );
})();