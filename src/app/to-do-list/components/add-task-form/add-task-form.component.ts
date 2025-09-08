import { Component, EventEmitter, Output, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task-form.component.html',
  styleUrls: ['./add-task-form.component.scss']
})
export class AddTaskFormComponent {
  private _newTask = signal<string>('');

  @Output() addTask = new EventEmitter<string>();

  get newTask() {
    return this._newTask.asReadonly();
  }

  updateNewTask(value: string): void {
    this._newTask.set(value);
  }

  onSubmit(): void {
    const text = this._newTask().trim();
    if (!text) return;

    this.addTask.emit(text);
    this._newTask.set('');
  }
}