import { google } from "googleapis"
import { auth } from '../../lib/google-api.ts';

export const checkIfUserCanReplyToTheSurvey = async ({ sheetId, messageTs, userId, blockId }: {  sheetId:string, messageTs:number, userId:string, blockId }) => {

  const messageDate = messageTs * 1000;
  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });
  
  try {
    const { data: sheetMetadata } = await drive.files.get({
      fileId: sheetId,
      fields: 'createdTime',
    });
   
    const createdTime = sheetMetadata?.createdTime;
    if (!createdTime) {
      throw new Error('Sheet created time is undefined');
    }
    const sheetCreatedTime = new Date(createdTime).getTime(); 

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
    if (error instanceof Error) {
      console.error('Erreur lors de la vérification des réponses utilisateur :', error.message);
    } else {
      console.error('Erreur lors de la vérification des réponses utilisateur :', error);
    }
    return false; 
  }
};
