import bolt from '@slack/bolt';
import dotenv from 'dotenv';
dotenv.config();


// Initializes your app with your bot token and signing secret
export const app = new bolt.App({
  token: process.env.BOT_USER_OAUTH_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 7000,
});

