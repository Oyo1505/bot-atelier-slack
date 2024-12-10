import { google } from 'googleapis';
import {auth} from '../../lib/google-api.js';
import { RANGE_GOOGLE_SHEET } from '../../shared/constants.js';


export async function appendToGoogleSheets({userId, userName, answerText, answerId, sheetId, blockId, messageTs}) {
  if(!userId || !userName || !answerText || !answerId || !sheetId || !blockId) return false;
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId: sheetId,
    range: RANGE_GOOGLE_SHEET,
    valueInputOption: 'RAW',
    resource: {
      values: [
        [userId, userName, answerId, answerText, blockId, messageTs],
      ],
    },
  };
  try {
   await sheets.spreadsheets.values.append(request);
  const formulas = [
    { range: 'G2', values: [['=COUNTUNIQUE(A2:A)']] }, 
     // Taux pour chaque réponse de q_1
    { range: 'I2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_1_q_1") / COUNTIF(E:E, "q_1") * 100']] },
    { range: 'J2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_2_q_1") / COUNTIF(E:E, "q_1") * 100']] },
    { range: 'K2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_3_q_1") / COUNTIF(E:E, "q_1") * 100']] },
    { range: 'L2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_4_q_1") / COUNTIF(E:E, "q_1") * 100']] },
    { range: 'M2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_5_q_1") / COUNTIF(E:E, "q_1") * 100']] },
    
    // Taux pour chaque réponse de q_2
    { range: 'I3', values: [['=COUNTIFS(E:E, "q_2", C:C, "reponse_1_q_2") / COUNTIF(E:E, "q_2") * 100']] },
    { range: 'J3', values: [['=COUNTIFS(E:E, "q_2", C:C, "reponse_2_q_2") / COUNTIF(E:E, "q_2") * 100']] },
    { range: 'K3', values: [['=COUNTIFS(E:E, "q_2", C:C, "reponse_3_q_2") / COUNTIF(E:E, "q_2") * 100']] },
    
    // Taux pour chaque réponse de q_3
    { range: 'I4', values: [['=COUNTIFS(E:E, "q_3", C:C, "reponse_1_q_3") / COUNTIF(E:E, "q_3") * 100']] },
    { range: 'K4', values: [['=COUNTIFS(E:E, "q_3", C:C, "reponse_2_q_3") / COUNTIF(E:E, "q_3") * 100']] },
    { range: 'K4', values: [['=COUNTIFS(E:E, "q_3", C:C, "reponse_3_q_3") / COUNTIF(E:E, "q_3") * 100']] },
    { range: 'L4', values: [['=COUNTIFS(E:E, "q_3", C:C, "reponse_4_q_3") / COUNTIF(E:E, "q_3") * 100']] },
    { range: 'M4', values: [['=COUNTIFS(E:E, "q_3", C:C, "reponse_5_q_3") / COUNTIF(E:E, "q_3") * 100']] },
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