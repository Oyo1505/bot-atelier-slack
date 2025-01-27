import { app } from '../../lib/slack-app.ts';
import { sendQuestionsToUsers } from '../questions/send_questions-to-users.ts';
import { isAuthorizedUser } from '../../utils/bool/is-authorized-user.ts';
import { SlackCommandMiddlewareArgs } from '@slack/bolt';
import { fetchUsersList } from '../../utils/slack/fetch-all-users.ts';
import { createSheetToGooleDrive } from '../../utils/google-drive/create-sheet-to-google-drive.ts';
import { UserListResult } from '../../model/user.ts';


/**
 * A set to keep track of registered actions.
 * 
 * This set stores strings representing the actions that have been registered.
 * It ensures that each action is only registered once.
 */

export const commandSurvey = async() => {
 const users = await fetchUsersList() as UserListResult;

 await app.command('/survey', async ({ ack, body }: SlackCommandMiddlewareArgs) => {
    if(!isAuthorizedUser(body.user_id)) return
    try {
      await ack();
      const sheetId = await createSheetToGooleDrive();
      const authorizedUser = users?.members?.filter(user => 
        user.real_name === 'Henri-Pierre Rigoulet' && 
        !user.is_bot && 
        user.is_email_confirmed && 
        !user.deleted
      )[0];

      if (authorizedUser !== undefined){
         await sendQuestionsToUsers(users, sheetId);
         return;
        }

      return;
    } catch (error) {
      console.log(error);
    }
  })
};