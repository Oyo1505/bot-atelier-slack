import { SurveyRepository } from '../../domain/ports/SurveyRepository';
import { Survey, SurveyResponse, SurveyReport, QuestionResult, OptionResult } from '../../domain/entities/Survey';
import { google } from 'googleapis';
import { auth } from '../../../lib/google-api';
import { RANGE_GOOGLE_SHEET } from '../../../shared/constants';

export class GoogleDriveSurveyRepository implements SurveyRepository {
  private sheets = google.sheets({ version: 'v4', auth });
  private drive = google.drive({ version: 'v3', auth });

  async createSurvey(name: string): Promise<Survey> {
    try {
   
      const { data: sheetData } = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: { title: name }
        }
      });

      const spreadsheetId = sheetData.spreadsheetId;
      if (!spreadsheetId) {
        throw new Error('Failed to create spreadsheet');
      }

      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [['UserId', 'UserName', 'AnswerId', 'AnswerText', 'BlockId', 'MessageTimeStamp', 'TotalUsers']]
        }
      });

   
      await this.drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: { role: 'writer', type: 'anyone' }
      });

      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      if (folderId) {
        await this.drive.files.update({
          fileId: spreadsheetId,
          addParents: folderId,
          removeParents: '',
          fields: 'id, parents'
        });
      }

      return {
        id: spreadsheetId,
        name,
        questions: this.getDefaultQuestions(),
        createdAt: new Date(),
        responses: []
      };
    } catch (error) {
      console.error('Erreur lors de la création du sondage:', error);
      throw error;
    }
  }

  async getLatestSurvey(): Promise<Survey | null> {
    try {
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
        fields: 'files(id, name, mimeType, createdTime)',
        orderBy: 'createdTime desc'
      });

      if (response.data.files && response.data.files.length > 0) {
        const file = response.data.files[0];
        return {
          id: file.id!,
          name: file.name!,
          questions: this.getDefaultQuestions(),
          createdAt: new Date(file.createdTime!),
          responses: await this.getSurveyResponses(file.id!)
        };
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier sondage:', error);
      return null;
    }
  }

  async saveResponse(response: SurveyResponse): Promise<void> {
    try {
      const request = {
        spreadsheetId: await this.getLatestSheetId(),
        range: RANGE_GOOGLE_SHEET,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            response.userId,
            response.userName,
            response.answerId,
            response.answerText,
            response.questionId,
            response.timestamp
          ]]
        }
      };

      await this.sheets.spreadsheets.values.append(request);
      await this.updateFormulas();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la réponse:', error);
      throw error;
    }
  }

  async getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: surveyId,
        range: 'A:F'
      });

      const values = response.data.values || [];
      return values.slice(1).map(row => ({
        userId: row[0],
        userName: row[1],
        answerId: row[2],
        answerText: row[3],
        questionId: row[4],
        timestamp: parseInt(row[5])
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses:', error);
      return [];
    }
  }

  async generateReport(surveyId: string): Promise<SurveyReport> {
    try {
      const responses = await this.getSurveyResponses(surveyId);
      const totalUsers = new Set(responses.map(r => r.userId)).size;

      const questionResults = this.getDefaultQuestions().map(question => {
        const questionResponses = responses.filter(r => r.questionId === question.id);
        const totalResponses = questionResponses.length;
        
        const optionResults = question.options.map(option => {
          const optionCount = questionResponses.filter(r => r.answerId === option.id).length;
          const percentage = totalResponses > 0 ? (optionCount / totalResponses) * 100 : 0;
          
          return {
            optionText: option.text,
            percentage
          };
        });

        return {
          questionId: question.id,
          questionText: question.question,
          optionResults
        };
      });

      return { totalUsers, questionResults };
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      throw error;
    }
  }

  async checkUserAlreadyResponded(userId: string, surveyId: string, questionId: string): Promise<boolean> {
    try {
      const responses = await this.getSurveyResponses(surveyId);
      return responses.some(r => r.userId === userId && r.questionId === questionId);
    } catch (error) {
      console.error('Erreur lors de la vérification des réponses:', error);
      return false;
    }
  }

  async checkUserCanReplyToSurvey(userId: string, surveyId: string, messageTimestamp: number): Promise<boolean> {
    try {
      const { data: sheetMetadata } = await this.drive.files.get({
        fileId: surveyId,
        fields: 'createdTime'
      });

      const createdTime = sheetMetadata?.createdTime;
      if (!createdTime) {
        return false;
      }

      const sheetCreatedTime = new Date(createdTime).getTime();
      const messageDate = messageTimestamp * 1000;

      if (messageDate < sheetCreatedTime) {
        return false;
      }

      const responses = await this.getSurveyResponses(surveyId);
      const userResponses = responses.filter(r => r.userId === userId);
      
      if (userResponses.length === 0) return true;
      
      const lastResponseTimestamp = Math.max(...userResponses.map(r => r.timestamp));
      return lastResponseTimestamp < messageDate;
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return false;
    }
  }

  private async getLatestSheetId(): Promise<string> {
    const survey = await this.getLatestSurvey();
    if (!survey) {
      throw new Error('Aucun sondage trouvé');
    }
    return survey.id;
  }

  private async updateFormulas(): Promise<void> {
    const sheetId = await this.getLatestSheetId();
    const formulas = [
      { range: 'G2', values: [['=COUNTUNIQUE(A2:A)']] },
      { range: 'I2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_1_q_1") / COUNTIF(E:E, "q_1") * 100']] },
      { range: 'J2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_2_q_1") / COUNTIF(E:E, "q_1") * 100']] },
      { range: 'K2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_3_q_1") / COUNTIF(E:E, "q_1") * 100']] },
      { range: 'L2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_4_q_1") / COUNTIF(E:E, "q_1") * 100']] },
      { range: 'M2', values: [['=COUNTIFS(E:E, "q_1", C:C, "reponse_5_q_1") / COUNTIF(E:E, "q_1") * 100']] }
    ];

    await this.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        data: formulas,
        valueInputOption: 'USER_ENTERED'
      }
    });
  }

  private getDefaultQuestions() {
    return [
      {
        id: 'q_1',
        question: 'Comment te sens-tu après cette semaine ? (1 à 5)',
        options: [
          { id: 'reponse_1_q_1', text: '1 : Ça va pas du tout 😔', value: 'reponse_1' },
          { id: 'reponse_2_q_1', text: '2 : Pas ouf', value: 'reponse_2' },
          { id: 'reponse_3_q_1', text: '3 : Plutôt bien', value: 'reponse_3' },
          { id: 'reponse_4_q_1', text: '4 : Bonne semaine.', value: 'reponse_4' },
          { id: 'reponse_5_q_1', text: '5 : Excellente semaine.', value: 'reponse_5' }
        ]
      },
      {
        id: 'q_2',
        question: 'Quelle a été ta plus grande réussite cette semaine ?',
        options: [
          { id: 'reponse_1_q_2', text: 'J\'ai terminé un projet ! 🎉', value: 'reponse_1' },
          { id: 'reponse_2_q_2', text: 'J\'ai appris quelque chose !', value: 'reponse_2' },
          { id: 'reponse_3_q_2', text: 'J\'ai aidé un collègue ! 🤝', value: 'reponse_3' }
        ]
      },
      {
        id: 'q_3',
        question: 'Quelle difficulté as-tu rencontrée cette semaine ?',
        options: [
          { id: 'reponse_1_q_3', text: 'Un défi technique 🛠️', value: 'reponse_1' },
          { id: 'reponse_2_q_3', text: 'Une gestion de temps ⏳', value: 'reponse_2' },
          { id: 'reponse_3_q_3', text: 'Une communication interne 🤝', value: 'reponse_3' },
          { id: 'reponse_4_q_3', text: 'Un choix difficile 🤔', value: 'reponse_4' },
          { id: 'reponse_5_q_3', text: 'Un apprentissage 📚', value: 'reponse_5' }
        ]
      }
    ];
  }
}
