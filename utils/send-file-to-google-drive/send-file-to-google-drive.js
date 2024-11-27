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
   // Ajouter des formules pour les statistiques
  const formulas = [
    { range: 'F2', values: [['=COUNTUNIQUE(A2:A)']] }, 
    //{ range: 'F4', values: [['=AVERAGEIF(C:C, 1, C:C)']] }, 
  ];

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      data: formulas,
      valueInputOption: 'USER_ENTERED',
    },
  });
}