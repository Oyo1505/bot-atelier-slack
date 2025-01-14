import { google } from "googleapis";
import { auth } from "../../lib/google-api.ts";

export const checkIfUserAlreadyInSheet = async ({ userId, sheetId }: { userId: string, sheetId: string }) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
    range: 'A:A',
  });
  
  const values = response.data.values;

  if (!values) {
    return false;
  }

  return values.some(value => value.includes(userId) === true);
  } catch (error) {
    console.error('Erreur lors de la vérification des réponses utilisateur :', (error as Error).message);
    return false; 
  }
};