import { User, Users } from '../entities/User';

export interface UserRepository {
  findAll(): Promise<Users>;
  findById(id: string): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  findActiveUsers(): Promise<User[]>;
  checkUserPresence(userId: string): Promise<boolean>;
  isAuthorizedUser(userId: string): Promise<boolean>;
}
