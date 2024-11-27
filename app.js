import { app } from './lib/slack-app.js';
import { getSheetFromGoogleDrive } from './utils/get-sheet-from-google-drive/get-sheet-from-google-drive.js';
import { scheduleMessageToUsers } from './utils/send-question-to-users/send-question-to-users.js';

scheduleMessageToUsers();

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!', process.env.PORT || 3000 );
})();