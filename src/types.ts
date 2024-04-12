export type User = {
  username: string;
  name: string;
  password: string;
  userId: number;
};

export type Team = {
  name: string;
  id: string;
  inSession: boolean;
};
