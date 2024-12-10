import { google } from "googleapis";
import { auth } from "../../lib/google-api.js";


export const getValuesFromSheet = async (id) => {
  if(!id) return;
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: 'I:M',
    });

    return response.data.values;
  } catch (error) {
    console.error('Error authenticating:', error.message);
    throw error;
  }
};