import { app } from '../../lib/slack-app.ts';
import { sendQuestionsToUsers } from '../questions/send_questions-to-users.ts';
import { isAuthorizedUser } from '../../utils/bool/is-authorized-user.ts';
import { SlackCommandMiddlewareArgs } from '@slack/bolt';
import { WebAPICallResult } from '@slack/web-api';

interface UserListResult extends WebAPICallResult {
  members?: {
    real_name: string;
    is_bot: boolean;
    is_email_confirmed: boolean;
    deleted: boolean;
  }[];
}

export const commandSurvey = () => {
  app.command('/survey', async ({ ack, body }: SlackCommandMiddlewareArgs) => {
    if(!isAuthorizedUser(body.user_id)) return
    try {
      await ack();
      const users = await app.client.users.list({}) as UserListResult;
      const authorizedUser = users?.members?.filter(user => 
        user.real_name === 'Henri-Pierre Rigoulet' && 
        !user.is_bot && 
        user.is_email_confirmed && 
        !user.deleted
      )[0];
      if (authorizedUser !== undefined) await sendQuestionsToUsers();
    } catch (error) {
      console.log(error);
    }
  })
};