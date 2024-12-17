import { app } from '../lib/slack-app.js';
import { isAuthorizedUser } from '../utils/bool/is-authorized-user.js';
import { getTheLastSheetFromGoogleDrive } from '../utils/google-drive/get-the-last-sheet-from-google-drive.js';
import { getTotalUsersCount } from '../utils/google-drive/get-total-users-count.js';
import { getValuesFromSheet } from '../utils/google-drive/get-values-from-sheet.js';
import { questions } from '../utils/questions/random-question.js';


export const commandRapport = () => {
app.command('/rapport', async ({ ack, body }) => {

  if(!isAuthorizedUser(body.user_id)) return
  try {
   const userRapport = process.env.NODE_ENV === 'development' ? 'Henri-Pierre Rigoulet' : 'Sebastien Bortenlänger';
   await ack();
   const users = await app.client.users.list()
   const authorizedUser = users?.members?.filter(user => user.real_name === userRapport && user.is_bot === false && user.is_email_confirmed === true && user.deleted === false)[0];
   const sheet = await getTheLastSheetFromGoogleDrive()
   app.client.chat.postMessage({
      channel: authorizedUser.id,
      text: `Salut <@${authorizedUser.id}> ! Pour le questionnaire : ${sheet?.name}`,
    });
   const data = await getValuesFromSheet(sheet.id)
   const responses = data.splice(1, data.length)
   const totalUsersCount = await getTotalUsersCount(sheet.id)

   if(totalUsersCount !== null){
    app.client.chat.postMessage({
      channel: authorizedUser.id,
      text: `Le nombre total d'utilisateurs à avoir répondu est de ${totalUsersCount}`,
    });
   }
  
   if(responses !== null){
    
      questions.map(({ question, blocks},index)=>{
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