import pkg from '@slack/bolt';
import dotenv from 'dotenv';
dotenv.config();
const { App } = pkg;

// Initializes your app with your bot token and signing secret
export const app = new App({
  token: process.env.BOT_USER_OAUTH_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 7000,
});

