import { Component, signal, computed, ChangeDetectionStrategy, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginacaoComponent } from './components/paginacao/paginacao.component';
import { Tarefa } from './interfaces/tarefa.interface';
import { Toast } from './interfaces/toast.interface';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginacaoComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  private _tarefas = signal<Tarefa[]>([]);
  private _novaTarefa = signal<string>('');
  private _paginaAtual = signal<number>(1);
  private _itensPorPagina = signal<number>(4);
  public _toasts = signal<Toast[]>([]);
  private _idCounter = 0;

  public opcoesItensPorPagina: number[] = [4, 8, 16, 32];

  tarefas = this._tarefas.asReadonly();
  novaTarefa = this._novaTarefa.asReadonly();
  paginaAtual = this._paginaAtual.asReadonly();
  itensPorPagina = this._itensPorPagina.asReadonly();
  toasts = this._toasts.asReadonly();

  constructor() {
    // Persistência de tarefas no localStorage
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

  totalPaginas = computed(() => Math.ceil(this._tarefas().length / this._itensPorPagina()));
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
    this.mostrarToastMensagem('Tarefa adicionada', 'success');
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    this.mostrarToastMensagem('Não foi possível adicionar a tarefa', 'danger');
  }
}

concluirTarefa(tarefa: Tarefa): void {
  try {
    const tarefasAtualizadas = this._tarefas().map(t =>
      t.id === tarefa.id
        ? { ...t, concluida: !t.concluida, dataConclusao: t.concluida ? undefined : new Date() }
        : t
    );
    this._tarefas.set(tarefasAtualizadas);

    if (!tarefa.concluida) {
      this.mostrarToastMensagem('Tarefa concluída', 'success');
    }
  } catch (error) {
    console.error('Erro ao concluir tarefa:', error);
    this.mostrarToastMensagem('Não foi possível concluir a tarefa', 'danger');
  }
}

  excluirTarefa(id: number): void {
    const atualizadas = this._tarefas().filter(t => t.id !== id);
    this._tarefas.set(atualizadas);

    const totalPaginasAtual = Math.ceil(atualizadas.length / this._itensPorPagina());
    if (this._paginaAtual() > totalPaginasAtual && totalPaginasAtual > 0) {
      this._paginaAtual.set(totalPaginasAtual);
    }

    this.mostrarToastMensagem('Tarefa excluída', 'success');
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

  mostrarToastMensagem(mensagem: string, tipo: Toast['tipo']): void {
    const id = ++this._idCounter;
    this._toasts.update(lista => [...lista, { id, mensagem, tipo, visivel: true }]);
    setTimeout(() => this._toasts.update(lista => lista.filter(t => t.id !== id)), 5000);
  }

  fecharToast(id: number) {
    this._toasts.update(lista => lista.filter(t => t.id !== id));
  }
}
