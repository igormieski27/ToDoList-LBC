import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { TasksTableComponent } from './components/tasks-table/tasks-table.component';
import { AddTaskFormComponent } from './components/add-task-form/add-task-form.component';
import { TaskService } from './services/task.service';
import { ToastService } from '../shared/services/toast.service';
import { Task } from './interfaces/task.interface';

@Component({
  selector: 'to-do-list',
  standalone: true,
  imports: [
    FormsModule,
    PaginationComponent,
    ToastComponent,
    HeaderComponent,
    FooterComponent,
    TasksTableComponent,
    AddTaskFormComponent,
  ],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoListComponent implements OnInit {
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  private _currentPage = signal<number>(1);
  private _itemsPerPage = signal<number>(4);

  public itemsPerPageOptions: number[] = [4, 8, 16, 32];

  currentPage = this._currentPage.asReadonly();
  itemsPerPage = this._itemsPerPage.asReadonly();

  tasks = this.taskService.tasks;

  constructor() {}

  ngOnInit(): void {
    this.taskService.loadTasks();
    this.cdr.detectChanges();
  }

  paginatedTasks = computed(() => {
    const start = (this._currentPage() - 1) * this._itemsPerPage();
    const end = start + this._itemsPerPage();
    return this.tasks().slice(start, end);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.tasks().length / this._itemsPerPage())));
  totalTasks = computed(() => this.tasks().length);

  onItemsPerPageChange(newValue: number): void {
    this._itemsPerPage.set(newValue);
    this._currentPage.set(1);
  }

  addTask(text: string): void {
    try {
      this.taskService.addTask(text);
      this._currentPage.set(1);
      this.toastService.show('Tarefa adicionada', 'success');
    } catch {
      this.toastService.show('Não foi possível adicionar a tarefa', 'danger');
    }
  }

  completeTask(task: Task): void {
    try {
      this.taskService.completeTask(task);
      if (!task.finished) {
        this.toastService.show('Tarefa concluída', 'success');
      }
    } catch {
      this.toastService.show('Não foi possível concluir a tarefa', 'danger');
    }
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    const totalPagesAfterDeletion = Math.max(
      1,
      Math.ceil(this.tasks().length / this._itemsPerPage()),
    );
    this._currentPage.set(Math.min(this._currentPage(), totalPagesAfterDeletion));
    this.toastService.show('Tarefa excluída', 'success');
  }

  previousPage(): void {
    if (this.currentPage() > 1) this._currentPage.update((p) => p - 1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) this._currentPage.update((p) => p + 1);
  }
}
