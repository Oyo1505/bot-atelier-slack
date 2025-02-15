import { SlackCommandMiddlewareArgs } from "@slack/bolt"
import { app } from "../../lib/slack-app"
import mistral from "../../lib/mistral.app"
import { getTheLastSheetFromGoogleDrive } from "../../utils/google-drive/get-the-last-sheet-from-google-drive.ts"


const shouldCallFunction = async (userMessage:string) => {
  const tools = [
    {
      type: "function" as const,
      function: {
        name: "get_last_google_sheet",
        description: "Récupère le dernier fichier Google Sheet du dossier Drive.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    },
  ];

  const response = await mistral.chat.complete({
    model: "mistral-large-2411",
    messages: [
      {role: "system", content: 'repond seulement en francais'},
      { role: "user", content: userMessage }],
    tools: tools,
    toolChoice: "auto",
  });

  const toolCalls = response?.choices?.[0]?.message?.toolCalls;
  return toolCalls && toolCalls.length > 0 && toolCalls[0].function.name === "get_last_google_sheet";
};

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