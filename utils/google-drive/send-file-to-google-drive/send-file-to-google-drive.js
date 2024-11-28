import { google } from 'googleapis';
import {auth} from '../../../lib/google-api.js';
import { RANGE_GOOGLE_SHEET } from '../../../shared/constants.js';


export async function appendToGoogleSheets({userId, userName, answerText, answerId, sheetId, blockId}) {
  if(!userId || !userName || !answerText || !answerId || !sheetId || !blockId) return false;
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
  try {
   await sheets.spreadsheets.values.append(request);
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
  return true;
  } catch (error) {
    console.error('Error authenticating:', error.message);
    throw error;
  }
}