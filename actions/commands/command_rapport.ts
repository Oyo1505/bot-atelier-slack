import { app } from '../../lib/slack-app.ts';
import { isAuthorizedUser } from '../../utils/bool/is-authorized-user.ts';
import { questions } from '../questions/random-question.ts';
import { SlackCommandMiddlewareArgs } from '@slack/bolt';
import { WebAPICallResult } from '@slack/web-api';
import { SlackUser } from '../../model/user.ts';
import { getTheLastSheetFromGoogleDrive } from '../../utils/google-drive/get-the-last-sheet-from-google-drive.ts';
import { getValuesFromSheet } from '../../utils/google-drive/get-values-from-sheet.ts';
import { getTotalUsersCount } from '../../utils/google-drive/get-total-users-count.ts';

interface Question {
  question: string;
  blocks: {
    type: string;
    elements?: {
      text: {
        text: string;
      };
    }[];
  }[];
}



export const commandRapport = () => {
app.command('/rapport', async ({ ack, body }: SlackCommandMiddlewareArgs) => {

  if(!isAuthorizedUser(body.user_id)) return
  try {
   const userRapport = process.env.NODE_ENV === 'development' ? 'Henri-Pierre Rigoulet' : 'Sebastien Bortenlänger';
   await ack();
   const users = await app.client.users.list({}) as WebAPICallResult & { members: SlackUser[] };
   const authorizedUser = users?.members?.filter((user: SlackUser) => 
     user.real_name === userRapport && 
     user.is_bot === false && 
     user.is_email_confirmed === true && 
     user.deleted === false
   )[0];
   const sheet = await getTheLastSheetFromGoogleDrive()
   app.client.chat.postMessage({
      channel: authorizedUser.id,
      text: `Salut <@${authorizedUser.id}> ! Pour le questionnaire : ${sheet?.name}`,
    });
   const data = sheet?.id &&  await getValuesFromSheet(sheet.id)
   const responses =  data&&  data?.splice(1, data.length)
   const totalUsersCount = sheet?.id && await getTotalUsersCount(sheet.id)

   if(totalUsersCount !== null){
    app.client.chat.postMessage({
      channel: authorizedUser.id,
      text: `Le nombre total d'utilisateurs à avoir répondu est de ${totalUsersCount}`,
    });
   }
  
   if(responses !== null && responses){
      questions.map(({ question, blocks }: Question, index: number) => {
        app.client.chat.postMessage({
          channel: authorizedUser?.id,
          text: `Pour la question "${question}" le pourcentage par réponse est :${
          blocks[1]?.elements?.map(({text}, i) => {
              return `\n ${text?.text}: ${Math.round(responses[index][i])}%`
            })}`,
        });  
      })
  }
  } catch (error) {
    console.log(error);
  }
})};