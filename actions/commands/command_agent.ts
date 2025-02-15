import { SlackCommandMiddlewareArgs } from "@slack/bolt"
import { app } from "../../lib/slack-app"
import mistral from "../../lib/mistral.app"
import { getTheLastSheetFromGoogleDrive } from "../../utils/google-drive/get-the-last-sheet-from-google-drive.ts"
import { shouldCallFunction } from "../../utils/mistral/should-call-function-get_last_google_sheet.ts"




export const commandAgent = async() => {
  try {
    await app.command('/agent', async ({ ack, body }: SlackCommandMiddlewareArgs) => {
      try {
      await ack();

      const userMessage = body.text;

      if (await shouldCallFunction(userMessage)) { 
        const lastSheet = await getTheLastSheetFromGoogleDrive();
        const date = lastSheet?.createdTime ? new Date(lastSheet?.createdTime).toLocaleDateString("fr") : null;
        const responseText = !lastSheet 
          ? `❌ Aucun fichier trouvé dans le dossier Drive.`
          : `📂 Dernier fichier: *${lastSheet?.name}* (ID: ${lastSheet?.id}) - Créé le ${date}
          Voici le lien pour le consulter: https://docs.google.com/spreadsheets/d/${lastSheet?.id}/edit#gid=0
          `;

        await app.client.chat.postMessage({
          channel: body.channel_id,
          text: responseText,
        });

        return;
      }

     const response =  await mistral.chat.complete({
        model: "mistral-large-2411",
        temperature: 1,
        messages: [
          {role: "system", content: 'repond seulement en francais'},
          {role: "user", content: userMessage },
        ],
      })
   
      await app.client.chat.postMessage({
        channel: body.channel_id,
        text: String(response?.choices?.[0]?.message?.content ?? ''),
      });
   
      } catch (error) {
        console.log(error);
      }
    })
  } catch (error) {
    console.log(error);
  }
}