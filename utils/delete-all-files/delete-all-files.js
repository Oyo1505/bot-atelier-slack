export const deleteAllFiles = async () => {
  try {
    // Initialisation du client Drive
    const drive = google.drive({ version: 'v3', auth });
    console.log('Fichiers trouvés :');
    // Options pour la requête
    let pageToken = null; // Token pour paginer les résultats
    const files = [];

    do {
      const response = await drive.files.list({
        q: "'root' in parents", // Requêtes personnalisées, exemple : fichiers dans le dossier racine
        fields: 'nextPageToken, files(id, name, mimeType, parents)', // Propriétés des fichiers à récupérer
        pageSize: 100, // Nombre maximal de fichiers par requête
        pageToken: pageToken, // Token pour la pagination
      });

      files.push(...response.data.files);
      pageToken = response.data.nextPageToken; // Récupérer le token pour la page suivante
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
