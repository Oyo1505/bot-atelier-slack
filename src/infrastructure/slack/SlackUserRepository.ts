import { UserRepository } from '../../domain/ports/UserRepository';
import { User, Users } from '../../domain/entities/User';
import { app } from '../../../lib/slack-app';
import { usersTeamProduit } from '../../../shared/constants';

export class SlackUserRepository implements UserRepository {
  async findAll(): Promise<Users> {
    try {
      const response = await app.client.users.list({
        limit: 117,
        team_id: 'T1WTXHW03'
      });

      const members = response.members?.map(this.mapSlackUserToUser) || [];
      return { members };
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const response = await app.client.users.info({ user: id });
      return response.user ? this.mapSlackUserToUser(response.user) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  async findByName(name: string): Promise<User | null> {
    const users = await this.findAll();
    return users.members.find(user => user.realName === name) || null;
  }

  async findActiveUsers(): Promise<User[]> {
    const users = await this.findAll();
    return users.members.filter(user => 
      user.realName && 
      usersTeamProduit.includes(user.realName) && 
      !user.isBot && 
      user.isEmailConfirmed && 
      !user.deleted
    );
  }

  async checkUserPresence(userId: string): Promise<boolean> {
    try {
      const presence = await app.client.users.getPresence({ user: userId });
      return presence.presence === 'active';
    } catch (error) {
      console.error('Erreur lors de la vérification de la présence:', error);
      return false;
    }
  }

  async isAuthorizedUser(userId: string): Promise<boolean> {
    const userIdForRapport = process.env.NODE_ENV === 'development' 
      ? 'U03GQPE5CV9' 
      : 'U1X0X7NBE';
    return userId === userIdForRapport;
  }

  private mapSlackUserToUser(slackUser: any): User {
    return {
      id: slackUser.id,
      realName: slackUser.real_name,
      isBot: slackUser.is_bot,
      isEmailConfirmed: slackUser.is_email_confirmed,
      deleted: slackUser.deleted
    };
  }
}
