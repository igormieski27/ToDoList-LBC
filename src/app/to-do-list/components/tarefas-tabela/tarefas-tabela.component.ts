import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tarefa } from '../../interfaces/tarefa.interface';

@Component({
  selector: 'app-tarefas-tabela',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarefas-tabela.component.html',
  styleUrls: ['./tarefas-tabela.component.scss']
})
export class TarefasTabelaComponent {
  @Input() tarefas: Tarefa[] = [];
  
  @Output() concluir = new EventEmitter<Tarefa>();
  @Output() excluir = new EventEmitter<number>();
  
  formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR') + ', ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  concluirTarefa(tarefa: Tarefa): void {
    this.concluir.emit(tarefa);
  }

  excluirTarefa(id: number): void {
    this.excluir.emit(id);
  }
}