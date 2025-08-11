import { UserRepository } from '../../domain/ports/UserRepository';
import { SurveyRepository } from '../../domain/ports/SurveyRepository';
import { MessagingPort } from '../../domain/ports/MessagingPort';
import { SlackUserRepository } from '../slack/SlackUserRepository';
import { GoogleDriveSurveyRepository } from '../google-drive/GoogleDriveSurveyRepository';
import { SlackMessagingAdapter } from '../slack/SlackMessagingAdapter';
import { SlackCommandHandler } from '../../application/SlackCommandHandler';
import { SlackActionHandler } from '../../application/SlackActionHandler';

export class Container {
  private static instance: Container;
  private userRepository!: UserRepository;
  private surveyRepository!: SurveyRepository;
  private messagingPort!: MessagingPort;
  private commandHandler!: SlackCommandHandler;
  private actionHandler!: SlackActionHandler;

  private constructor() {
    this.initializeDependencies();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeDependencies(): void {

    this.userRepository = new SlackUserRepository();
    this.surveyRepository = new GoogleDriveSurveyRepository();
    this.messagingPort = new SlackMessagingAdapter();


    this.commandHandler = new SlackCommandHandler(
      this.userRepository,
      this.surveyRepository,
      this.messagingPort
    );

    this.actionHandler = new SlackActionHandler(
      this.surveyRepository,
      this.messagingPort
    );
  }

  getUserRepository(): UserRepository {
    return this.userRepository;
  }

  getSurveyRepository(): SurveyRepository {
    return this.surveyRepository;
  }

  getMessagingPort(): MessagingPort {
    return this.messagingPort;
  }

  getCommandHandler(): SlackCommandHandler {
    return this.commandHandler;
  }

  getActionHandler(): SlackActionHandler {
    return this.actionHandler;
  }
}
