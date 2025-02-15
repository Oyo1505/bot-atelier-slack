import mistral from "../../lib/mistral.app";
import { getEmailsFromGmail } from "../gmail/get-email-user";

const embeddingMail = async (mail: string): any => {
  const mailFromUser = getEmailsFromGmail();
 const response = await  mistral.embeddings.create({
    model: "mistral-embed",
    inputs: '📧 cherche cette phrase',
  })
  return response.data[0].embedding;
}

export { embeddingMail };