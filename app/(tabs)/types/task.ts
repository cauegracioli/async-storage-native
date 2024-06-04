export type Status = "PENDING" | "CONCLUDE";

export interface ITasks {
  id: string;
  task: string;
  status: Status;
  date: string;
}
