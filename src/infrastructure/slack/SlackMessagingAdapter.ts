import { MessagingPort, Message } from '../../domain/ports/MessagingPort';
import { app } from '../../../lib/slack-app';

export class SlackMessagingAdapter implements MessagingPort {
  async sendMessage(message: Message): Promise<void> {
    try {
      await app.client.chat.postMessage({
        channel: message.channelId,
        text: message.text,
        blocks: message.blocks,
        thread_ts: message.threadTs
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message Slack:', error);
      throw error;
    }
  }

  async sendDirectMessage(userId: string, message: Message): Promise<void> {
    const channelId = await this.openDirectMessage(userId);
    await this.sendMessage({
      ...message,
      channelId
    });
  }

  async postMessageAsUser(userId: string, message: Message): Promise<void> {
    try {
      const userInfo = await app.client.users.info({ user: userId });
      const userAvatar = userInfo?.user?.profile?.image_512;

      await app.client.chat.postMessage({
        channel: message.channelId,
        text: message.text,
        username: userInfo?.user?.real_name,
        icon_url: userAvatar
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message en tant qu\'utilisateur:', error);
      throw error;
    }
  }

  async deleteMessage(channelId: string, messageTs: string): Promise<boolean> {
    try {
      const result = await app.client.chat.delete({ 
        channel: channelId, 
        ts: messageTs 
      });
      return result.ok || false;
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      return false;
    }
  }

  async openDirectMessage(userId: string): Promise<string> {
    try {
      const result = await app.client.conversations.open({
        users: userId
      });

      if (result.channel && result.channel.id) {
        return result.channel.id;
      } else {
        throw new Error('Failed to open direct message: channel is undefined');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la conversation directe:', error);
      throw error;
    }
  }
}
