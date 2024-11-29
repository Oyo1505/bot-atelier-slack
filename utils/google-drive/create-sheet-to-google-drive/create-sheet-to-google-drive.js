import { google } from "googleapis"
import { auth } from '../../../lib/google-api.js';

export async function createSheetToGooleDrive() {
  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });
  const date = new Date();
  const dateFormat = date.toLocaleDateString('fr-FR');

  try {
    const { data: sheetData } = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `Questions atelier du ${dateFormat}`,
        },
      },
    });
    
    const spreadsheetId = sheetData.spreadsheetId;
    const request = {
      spreadsheetId: spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      resource: {
        values: [
          ['UserId', 'UserName', 'AnswerId', 'AnswerText', 'BlockId','MessageTimeStamp', 'TotalUsers' ],
        ],
      },
    };

    await sheets.spreadsheets.values.update(request);
    await drive.permissions.create({
      
      fileId: spreadsheetId,
      requestBody: {
        role: 'writer', 
        type: 'anyone', 
      },
    });

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    await drive.files.update({
      fileId: spreadsheetId,
      addParents: folderId,
      removeParents: '',
      fields: 'id, parents',
    });

    return spreadsheetId;
  } catch (error) {
    console.error('Error creating or sharing the sheet:', error.message);
    throw error;
  }
}
