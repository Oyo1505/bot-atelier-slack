import { google } from "googleapis";
import { auth } from "../../lib/google-api";

const getEmailsFromGmail = async () => {
  const gmail = google.gmail({ version: "v1", auth });

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 50, // Nombre d'emails à récupérer
  });

  if (!response.data.messages) return [];

  const emailPromises = response.data.messages.map(async (msg) => {
    if (!msg.id) return null;
    const emailData = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });

    const headers = emailData?.data?.payload?.headers;
    const subject = headers?.find((h) => h.name === "Subject")?.value || "Sans sujet";
    const body = emailData.data.snippet;

    return { id: msg.id, subject, body };
  });

  return await Promise.all(emailPromises);
};

export { getEmailsFromGmail };