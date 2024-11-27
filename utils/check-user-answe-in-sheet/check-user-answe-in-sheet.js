import { google } from "googleapis"
import { auth } from '../../lib/google-api.js';
import { RANGE_GOOGLE_SHEET } from "../../shared/constants.js";

export const checkIfUserIsInSheet = async ({userId, sheetId, blockId}) => {
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: RANGE_GOOGLE_SHEET,
  });
  const values = response.data.values;
  if(!values) return false
  return values[0].includes(userId && blockId);
};
