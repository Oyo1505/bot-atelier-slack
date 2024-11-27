import { google } from 'googleapis';
import {auth} from '../../lib/google-api.js';
import { RANGE_GOOGLE_SHEET } from '../../shared/constants.js';


export async function appendToGoogleSheets({userId,userName, answerText, answerId, sheetId, blockId}) {

  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId: sheetId,
    range: RANGE_GOOGLE_SHEET,
    valueInputOption: 'RAW',
    resource: {
      values: [
        [userId,userName, answerId, answerText, blockId],
      ],
    },
  };
   await sheets.spreadsheets.values.append(request);

}