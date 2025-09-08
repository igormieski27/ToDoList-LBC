export interface Task {
  id: number;
  name: string;
  creationDate: Date;
  conclusionDate?: Date;
  finished: boolean;
}
