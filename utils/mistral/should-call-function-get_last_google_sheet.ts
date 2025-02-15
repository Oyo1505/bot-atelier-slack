import mistral from "../../lib/mistral.app";

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

export { shouldCallFunction };