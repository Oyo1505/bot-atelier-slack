import { google } from "googleapis"
import { auth } from '../../lib/google-api.js';

export const getSheetFromGoogleDrive = async (id) =>{
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.get({
        spreadsheetId: id,
    });

    return response.data;
  } catch (error) {
    console.error('Error authenticating:', error.message);
    throw error;
  }
  
}