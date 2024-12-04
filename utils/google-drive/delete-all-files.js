import { google } from "googleapis";
import { auth } from '../../lib/google-api.js'

export const deleteAllFiles = async () => {
  try {
    const drive = google.drive({ version: 'v3', auth });
    let pageToken = null; 
    const files = [];

    do {
      const response = await drive.files.list({
        q: "'root' in parents", 
        fields: 'nextPageToken, files(id, name, mimeType, parents)', 
        pageSize: 100, 
        pageToken: pageToken, 
      });

      files.push(...response.data.files);
      pageToken = response.data.nextPageToken; 
    } while (pageToken);

   
    const sheetsFiles = files.filter(file => file.mimeType === 'application/vnd.google-apps.spreadsheet');

    const deleteSheets = async () => {
      for (const file of sheetsFiles) {
        try {
          await drive.files.delete({ fileId: file.id });
          console.log(`Fichier supprimé : ${file.name} (ID: ${file.id})`);
        } catch (error) {
          console.error(`Erreur lors de la suppression du fichier ${file.name} :`, error);
        }
      }
    };
    deleteSheets()
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers :', error);
  }
};
