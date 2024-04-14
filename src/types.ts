export type User = {
  username: string;
  name: string;
  password: string;
  userId: number;
};

export type Team = {
  name: string;
  teamId: number;
  inSession: boolean;
};
