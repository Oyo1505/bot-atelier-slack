export interface Message {
  channelId: string;
  text: string;
  blocks?: any[];
  threadTs?: string;
}

export interface MessagingPort {
  sendMessage(message: Message): Promise<void>;
  sendDirectMessage(userId: string, message: Message): Promise<void>;
  postMessageAsUser(userId: string, message: Message): Promise<void>;
  deleteMessage(channelId: string, messageTs: string): Promise<boolean>;
  openDirectMessage(userId: string): Promise<string>;
}
