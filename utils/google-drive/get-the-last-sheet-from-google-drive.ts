
import { google } from "googleapis";
import { auth } from "../../lib/google-api.ts"

export const getTheLastSheetFromGoogleDrive = async () =>{
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  try{
    const drive = google.drive({ version: 'v3', auth });
    const sheet = await drive.files.list({
      q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
      fields: 'files(id, name, mimeType, parents, createdTime)',
    });
   
    if (sheet.data.files && sheet.data.files.length > 0) {
      return sheet.data.files[0];
    }
    return null;
  
  }catch(err){
    console.log(err)
  }

}