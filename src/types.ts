export type User = {
  username: string;
  name: string;
  password: string;
  userId: number;
};

export type Team = {
  name: string;
  teamId: number;
  startDateTime: string;
  endDateTime: string;
  goalDateTime: string;
};

export type Task = {
  taskId: string;
  title: number;
  description: string;
  status: string;
};
