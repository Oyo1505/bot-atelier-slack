import { google } from "googleapis";
import { auth } from "../../lib/google-api.js";

export const checkIfUserAlreadyInSheet = async ({ userId, sheetId }) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
    range: 'A:A',
  });
  
  const values = response.data.values;

  return values.some(value => value.includes(userId) === true);
  } catch (error) {
    console.error('Erreur lors de la vérification des réponses utilisateur :', error.message);
    return false; 
  }
};