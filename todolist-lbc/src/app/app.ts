import { Component, signal, computed, ChangeDetectionStrategy, effect, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginacaoComponent } from './components/paginacao/paginacao.component';
import { ToastComponent } from './components/toast/toast.component';
import { Tarefa } from './interfaces/tarefa.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginacaoComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  @ViewChild('toast') toastComponent?: ToastComponent;

  private _tarefas = signal<Tarefa[]>([]);
  private _novaTarefa = signal<string>('');
  private _paginaAtual = signal<number>(1);
  private _itensPorPagina = signal<number>(4);

  public opcoesItensPorPagina: number[] = [4, 8, 16, 32];

  tarefas = this._tarefas.asReadonly();
  novaTarefa = this._novaTarefa.asReadonly();
  paginaAtual = this._paginaAtual.asReadonly();
  itensPorPagina = this._itensPorPagina.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem('tarefas', JSON.stringify(this._tarefas()));
    });
  }

  ngOnInit(): void {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
      this._tarefas.set(JSON.parse(tarefasSalvas).map((t: any) => ({
        ...t,
        dataCriacao: new Date(t.dataCriacao),
        dataConclusao: t.dataConclusao ? new Date(t.dataConclusao) : undefined
      })));
    } else {
      this._tarefas.set([{ id: 1, nome: 'Tarefa nova', dataCriacao: new Date(), concluida: false }]);
    }
  }

  tarefasPaginadas = computed(() => {
    const inicio = (this._paginaAtual() - 1) * this._itensPorPagina();
    const fim = inicio + this._itensPorPagina();
    return this._tarefas().slice(inicio, fim);
  });

  totalPaginas = computed(() => Math.max(1, Math.ceil(this._tarefas().length / this._itensPorPagina())));
  totalTarefas = computed(() => this._tarefas().length);

  onItensPorPaginaChange(novoValor: number): void {
    this._itensPorPagina.set(novoValor);
    this._paginaAtual.set(1);
  }

  updateNovaTarefa(value: string): void {
    this._novaTarefa.set(value);
  }

  adicionarTarefa(): void {
    const texto = this._novaTarefa().trim();
    if (!texto) return;

    try {
      const tarefasAtuais = this._tarefas();
      const novoId = tarefasAtuais.length ? Math.max(...tarefasAtuais.map(t => t.id)) + 1 : 1;
      const nova: Tarefa = {
        id: novoId,
        nome: texto,
        dataCriacao: new Date(),
        concluida: false
      };
      this._tarefas.set([nova, ...tarefasAtuais]);
      this._novaTarefa.set('');
      this.toastComponent?.show('Tarefa adicionada', 'success');
    } catch {
      this.toastComponent?.show('Não foi possível adicionar a tarefa', 'danger');
    }
  }

  concluirTarefa(tarefa: Tarefa): void {
    try {
      const tarefasAtualizadas = this._tarefas().map(t =>
        t.id === tarefa.id
          ? {
              ...t,
              concluida: !t.concluida,
              dataConclusao: t.concluida ? undefined : new Date() // corrigido para refletir a mudança real
            }
          : t
      );
      this._tarefas.set(tarefasAtualizadas);

      if (!tarefa.concluida) {
        this.toastComponent?.show('Tarefa concluída', 'success');
      }
    } catch {
      this.toastComponent?.show('Não foi possível concluir a tarefa', 'danger');
    }
  }

  excluirTarefa(id: number): void {
    const atualizadas = this._tarefas().filter(t => t.id !== id);
    this._tarefas.set(atualizadas);
    const totalPaginasAtual = Math.max(1, Math.ceil(atualizadas.length / this._itensPorPagina()));
    this._paginaAtual.set(Math.min(this._paginaAtual(), totalPaginasAtual));
    this.toastComponent?.show('Tarefa excluída', 'success');
  }

  formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR') + ', ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  paginaAnterior(): void {
    if (this._paginaAtual() > 1) this._paginaAtual.update(p => p - 1);
  }

  proximaPagina(): void {
    if (this._paginaAtual() < this.totalPaginas()) this._paginaAtual.update(p => p + 1);
  }
}
