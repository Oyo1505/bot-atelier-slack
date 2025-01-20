export type SlackUser = {
  real_name: string;
  is_bot: boolean;
  is_email_confirmed: boolean;
  deleted: boolean;
  id: string;
}

export type  User = {
  id: string;
  real_name: string;
  is_bot: boolean;
  is_email_confirmed: boolean;
  deleted: boolean;
}

export type  Users = {
  members: User[];
}
