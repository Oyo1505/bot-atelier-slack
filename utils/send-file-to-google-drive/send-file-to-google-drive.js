import { google } from 'googleapis';
import {auth} from '../../lib/google-api.js';


export async function appendToGoogleSheets({userId,userName, answerText, answerId, sheetId}) {


  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId: sheetId,
    range: 'A1:D1',
    valueInputOption: 'RAW',
    resource: {
      values: [
        [userId,userName, answerId, answerText],
      ],
    },
  };
   await sheets.spreadsheets.values.append(request);

}