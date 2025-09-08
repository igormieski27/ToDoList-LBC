import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adicionar-tarefa-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adicionar-tarefa-form.component.html',
  styleUrls: ['./adicionar-tarefa-form.component.scss']
})
export class AdicionarTarefaFormComponent {
  private _novaTarefa = signal<string>('');

  @Output() adicionarTarefa = new EventEmitter<string>();

  get novaTarefa() {
    return this._novaTarefa.asReadonly();
  }

  updateNovaTarefa(value: string): void {
    this._novaTarefa.set(value);
  }

  onSubmit(): void {
    const texto = this._novaTarefa().trim();
    if (!texto) return;

    this.adicionarTarefa.emit(texto);
    this._novaTarefa.set('');
  }
}