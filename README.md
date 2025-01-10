# bot-atelier-slack
# AskioBot

Slack Survey Bot est un bot Slack qui permet de créer des sondages et de récupérer leurs résultats directement dans Slack via les commandes `/survey` et `/rapport`. Les sondages sont stockés dans un dossier Google Drive et peuvent également être lancés automatiquement chaque jeudi à 13h.

## Fonctionnalités
*Ne fonctionne qu'avec les personnes autorisés.*
- **Créer un sondage** : utilisez la commande `/survey` pour lancer un sondage.
- **Récupérer les résultats** : utilisez la commande `/rapport` pour consulter les résultats du sondage.
- **Stockage sécurisé** : tous les sondages et leurs résultats sont enregistrés dans un dossier spécifique sur Google Drive.

## Prérequis

### 1. Configuration Google Drive
1. **Créer un dossier Google Drive** :
   - Créez un dossier Google Drive qui stockera les sondages et leurs résultats.
   - Récupérez l'ID du dossier (visible dans l'URL du dossier). Exemple :  
     ```
     https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9
     ```
     Ici, l'ID du dossier est `1A2B3C4D5E6F7G8H9`.

2. **Compte de service Google** :
   - Accédez à la [Google Cloud Console](https://console.cloud.google.com/).
   - Créez un projet ou utilisez un projet existant.
   - Activez l'API Google Drive pour ce projet.
   - Créez un compte de service et générez une clé JSON.
   - Donnez au compte de service les permissions **Lecteur/Éditeur** sur le dossier Google Drive.

### 2. Configuration Slack
- Créez une application Slack via le [Slack API Dashboard](https://api.slack.com/apps).
- Configurez les commandes suivantes :
  - `/survey` : pour créer un sondage.
  - `/rapport` : pour récupérer les résultats.
- Notez les tokens nécessaires pour authentifier le bot dans votre espace de travail.

