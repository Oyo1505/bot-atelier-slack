import { google } from "googleapis";
import { auth } from "../../lib/google-api.ts"

export const getTheLastSheetIdFromGoogleDrive = async () => {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  try {
    const drive = await google.drive({ version: "v3", auth });
    const sheet = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
      fields: "files(id, name, mimeType, createdTime)",
      orderBy: "createdTime desc", // Tri par date de création décroissante
    });

    if (sheet.data.files && sheet.data.files.length > 0) {
      return sheet.data.files[0].id; // Retourne l'ID de la feuille la plus récente
    }

    console.warn("Aucune feuille trouvée dans le dossier.");
    return null;
  } catch (err) {
    console.error("Erreur lors de la récupération de la dernière feuille :", err);
    return null;
  }
};