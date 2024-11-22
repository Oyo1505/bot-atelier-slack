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

app.command('/mess', async ({ command, ack, client }) => {
  await ack(); // Acquitte la commande
  try {
    const userId = command.user_id; // Récupère l'ID de l'utilisateur qui a tapé la commande
    const result = await client.chat.postMessage({
      token: process.env.BOT_USER_OAUTH_TOKEN,
      channel: userId, // Envoie un DM à cet utilisateur
      text: `Salut <@${userId}>! Voici un message privé depuis ton bot 🚀`,
    });
    console.log('Message envoyé :', result);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message :', error);
  }
});

(async () => {
  // Start your app
  await app.start();
  console.log('⚡️ Bolt app is running!',process.env.PORT || 3000 );
})();