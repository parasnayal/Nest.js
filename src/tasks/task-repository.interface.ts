export interface Task {
  id: number;
  title: string;
  completed:boolean
}

export interface TaskRepository {
  findAll(): Promise<Task[]>;
}