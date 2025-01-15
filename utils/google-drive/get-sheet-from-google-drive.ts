import { google } from "googleapis"
import { auth } from '../../lib/google-api.ts';

export const getSheetFromGoogleDrive = async (id:string) =>{
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: 'A:E',
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
  
}