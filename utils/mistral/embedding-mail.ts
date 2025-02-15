import mistral from "../../lib/mistral.app";

const embeddingMail = async (text: string): Promise<number[] | undefined> => {
 const response = await  mistral.embeddings.create({
    model: "mistral-embed",
    inputs: text,
  })
  return response.data[0].embedding;
}

export { embeddingMail };