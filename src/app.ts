import { app } from '../lib/slack-app';
import { Container } from './infrastructure/di/Container';
import express from 'express';
import cron from 'node-cron';
import { SlackCommandMiddlewareArgs } from '@slack/bolt';
import { SlackActionMiddlewareArgs, BlockButtonAction } from '@slack/bolt';

const container = Container.getInstance();

const appExpress = express();
appExpress.listen(process.env.PORT_EXPRESS || 3000, () => {
  console.log(`Express server running on port ${process.env.PORT_EXPRESS || 3000}`);
});

app.command('/survey', async (args: SlackCommandMiddlewareArgs) => {
  await container.getCommandHandler().handleSurveyCommand(args);
});

app.command('/rapport', async (args: SlackCommandMiddlewareArgs) => {
  await container.getCommandHandler().handleRapportCommand(args);
});

app.action(/^reponse_/, async (args: SlackActionMiddlewareArgs<BlockButtonAction>) => {
  await container.getActionHandler().handleSurveyResponse(args);
});

const setupScheduledTasks = async () => {
  const userRepository = container.getUserRepository();
  const surveyRepository = container.getSurveyRepository();
  const messagingPort = container.getMessagingPort();

  // Weekly task (thursday at 12h)
  cron.schedule('0 0 12 * * 4', async () => {
    try {
      const users = await userRepository.findActiveUsers();
      const survey = await surveyRepository.createSurvey(
        `Questions atelier du ${new Date().toLocaleDateString('fr-FR')}`
      );

      for (const user of users) {
        try {
          const channelId = await messagingPort.openDirectMessage(user.id);
          const firstQuestion = survey.questions[0];
          
          if (firstQuestion) {
            await messagingPort.sendMessage({
              channelId,
              text: firstQuestion.question,
              blocks: createQuestionBlocks(firstQuestion)
            });
          }
        } catch (error) {
          console.error(`Erreur lors de l'envoi à l'utilisateur ${user.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la tâche planifiée hebdomadaire:', error);
    }
  });

  // Daily task (monday to wednesday, 9h-12h)
  cron.schedule('0 0 9-12 * * 1-3', async () => {
    try {
      const users = await userRepository.findActiveUsers();
      const survey = await surveyRepository.getLatestSurvey();
      
      if (!survey) {
        console.warn('Aucun sondage actif trouvé pour la tâche quotidienne');
        return;
      }

      for (const user of users) {
        try {
          const isOnline = await userRepository.checkUserPresence(user.id);
          const alreadyResponded = await surveyRepository.checkUserAlreadyResponded(
            user.id, 
            survey.id, 
            survey.questions[0].id
          );

          if (!alreadyResponded && isOnline) {
            const channelId = await messagingPort.openDirectMessage(user.id);
            const firstQuestion = survey.questions[0];
            
            if (firstQuestion) {
              await messagingPort.sendMessage({
                channelId,
                text: firstQuestion.question,
                blocks: createQuestionBlocks(firstQuestion)
              });
            }
          }
        } catch (error) {
          console.error(`Erreur lors de l'envoi quotidien à l'utilisateur ${user.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la tâche planifiée quotidienne:', error);
    }
  });
};


function createQuestionBlocks(question: any): any[] {
  return question.blocks || [];
}


(async () => {
  try {
    await setupScheduledTasks();
    await app.start();
    console.log('⚡️ Bolt app is running!', process.env.PORT || 3000);
  } catch (error) {
    console.error('Erreur lors du démarrage de l\'application:', error);
    process.exit(1);
  }
})();
