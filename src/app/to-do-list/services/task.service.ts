import { Injectable, signal, effect, computed } from '@angular/core';
import { Task } from '../../to-do-list/interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([]);

  tasks = this._tasks.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem('tarefas', JSON.stringify(this._tasks()));
    });
  }

  loadTasks(): void {
    const defaultTasks: Task[] = [
      {
        id: 1,
        name: 'Falar com o Filipe Zuzarte',
        creationDate: new Date('2023-10-10T20:00:00'),
        finished: false,
      },
      {
        id: 2,
        name: 'Fazer deploy do projeto',
        creationDate: new Date('2023-10-10T19:00:00'),
        finished: false,
      },
      {
        id: 3,
        name: 'Fazer a folha de horas',
        creationDate: new Date('2023-10-10T18:00:00'),
        finished: false,
      },
    ];

    const savedTasks = localStorage.getItem('tarefas');
    if (savedTasks) {
      this._tasks.set(
        JSON.parse(savedTasks).map((t: any) => ({
          ...t,
          creationDate: new Date(t.creationDate),
          conclusionDate: t.finished ? new Date(t.finished) : undefined,
        })),
      );
    } else {
      this._tasks.set(defaultTasks);
    }
  }

  addTask(text: string): void {
    const currentTasks = this._tasks();
    const newId = currentTasks.length ? Math.max(...currentTasks.map((t) => t.id)) + 1 : 1;
    const newTask: Task = {
      id: newId,
      name: text,
      creationDate: new Date(),
      finished: false,
    };
    this._tasks.set([newTask, ...currentTasks]);
  }

  completeTask(task: Task): void {
    const updatedTasks = this._tasks().map((t) =>
      t.id === task.id
        ? {
            ...t,
            finished: !t.finished,
            conclusionDate: t.finished ? undefined : new Date(),
          }
        : t,
    );
    this._tasks.set(updatedTasks);
  }

  deleteTask(id: number): void {
    const updatedTasks = this._tasks().filter((t) => t.id !== id);
    this._tasks.set(updatedTasks);
  }
}
