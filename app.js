import dotenv from 'dotenv';
dotenv.config();
import pkg from '@slack/bolt';
const { App } = pkg;
import cron from 'node-cron';
import { randomQuestion } from './utils/random-question/random-question.js';

const SCHEDULE_WEEKLY = '0 21 14 * * 1'

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.BOT_USER_OAUTH_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.message('hello', async ({ message, say }) => {
  console.log(`Received a direct message from user ${message.user}`);
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

app.command('/hello', async ({ command, ack, say }) => {
  console.log(`Received a direct message from user ${command.user_id}`);
	await ack();
	await say(`Hello, <@${command.user_id}>`);
});

cron.schedule(SCHEDULE_WEEKLY, () => {

  app.client.users.list().then(res => {
    res.members.forEach(member => {
      if (member.real_name === 'Henri-Pierre Rigoulet' && member.is_bot === false && member.is_email_confirmed === true && member.deleted === false) {
        app.client.chat.postMessage({
          channel: member.id,
          text: `Salut <@${member.id}>! ${randomQuestion()}?`,
        });
      }
    });
  }).then(() => {
    console.log('Messages envoyés');
  }).catch(err => {
    console.error("Erreur lors de l'envoi du message :", err);
  });
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!',process.env.PORT || 3000 );
})();