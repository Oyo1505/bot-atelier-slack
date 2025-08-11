export interface User {
  id: string;
  realName: string;
  isBot: boolean;
  isEmailConfirmed: boolean;
  deleted: boolean;
  presence?: 'active' | 'away' | 'offline';
}

export interface Users {
  members: User[];
}
