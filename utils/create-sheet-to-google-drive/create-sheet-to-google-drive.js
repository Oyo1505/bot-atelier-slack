import { google } from "googleapis"
import { auth } from '../../lib/google-api.js';

export async function createSheetToGooleDrive() {
  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });
  const date = new Date();
  const dateFormat = date.toLocaleDateString('fr-FR');

  try {
    // Étape 1 : Créer une feuille de calcul
    const { data: sheetData } = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `Questions atelier du ${dateFormat}`,
        },
      },
    });
    
    const spreadsheetId = sheetData.spreadsheetId;
    // Ajouter les titres des colonnes
    const request = {
      spreadsheetId: spreadsheetId,
      range: 'A1', // Ligne 1 pour les en-têtes
      valueInputOption: 'RAW',
      resource: {
        values: [
          ['UserId', 'UserName', 'AnswerId', 'AnswerText', 'BlockId', 'TotalUsers'],
        ],
      },
    };

    await sheets.spreadsheets.values.update(request);

    // Étape 2 : Modifier les permissions pour rendre la feuille publique
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
      removeParents: '', // Optionnel, à utiliser si vous voulez retirer le fichier de son emplacement par défaut
      fields: 'id, parents',
    });

    return spreadsheetId;
  } catch (error) {
    console.error('Error creating or sharing the sheet:', error.message);
    throw error;
  }
}
