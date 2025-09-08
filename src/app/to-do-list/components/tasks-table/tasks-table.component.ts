import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [],
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
})
export class TasksTableComponent {
  @Input() tasks: Task[] = [];

  @Output() complete = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  formatDate(date: Date): string {
    return (
      date.toLocaleDateString('pt-BR') +
      ', ' +
      date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    );
  }

  completeTask(task: Task): void {
    this.complete.emit(task);
  }

  deleteTask(id: number): void {
    this.delete.emit(id);
  }
}
