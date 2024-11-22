const dotenv = require('dotenv');
dotenv.config();
const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.BOT_USER_OAUTH_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

// Listens to incoming messages that contain "hello"
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

(async () => {
  // Start your app
  await app.start();
  console.log('⚡️ Bolt app is running!',process.env.PORT || 3000 );
})();