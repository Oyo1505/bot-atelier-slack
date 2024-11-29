import { google } from "googleapis"
import { auth } from '../../../lib/google-api.js';

export const checkIfUserCanReply = async ({ sheetId, messageTs, userId, blockId }) => {
  if (!sheetId) return false; 
  const messageDate = messageTs * 1000;
  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });
  
  try {
    const { data: sheetMetadata } = await drive.files.get({
      fileId: sheetId,
      fields: 'createdTime',
    });
   
    const sheetCreatedTime = new Date(sheetMetadata.createdTime).getTime(); 

    if (messageDate < sheetCreatedTime) {
      return false;
    }
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A:F',
    });
  
    const values = response.data.values || []; 
    const userResponses = values.filter(
      row => row[0] === userId && row[4] === blockId
    );
   
    if (userResponses.length === 0) return true;
    
    const lastResponseTimestamp = Number(userResponses[0][5]);
    return lastResponseTimestamp < messageDate; 

  } catch (error) {
    console.error('Erreur lors de la vérification des réponses utilisateur :', error.message);
    return false; 
  }
};
