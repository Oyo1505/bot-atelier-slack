import { google } from "googleapis";
import { auth } from "../../lib/google-api.ts";


export const getTotalUsersCount = async (id:string) => {
  if(!id) return;
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: 'G2',
    });

    return response.data.values;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error authenticating:', error.message);
    } else {
      console.error('Error authenticating:', error);
    }
    throw error;
  }
};