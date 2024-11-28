import { google } from "googleapis"
import { auth } from '../../lib/google-api.js';

export const checkIfUserIsInSheet = async ({userId, sheetId, blockId}) => {
  if(!userId || !sheetId || !blockId) return false;
  
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A:E',
  });
  const values = response.data.values;
  if(!values) return false
  return values.some(value => value.includes(userId) === true && value.includes(blockId) === true);
};
