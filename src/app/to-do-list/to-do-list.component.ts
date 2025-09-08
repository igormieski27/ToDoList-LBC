import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
  effect,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginacaoComponent } from '../shared/components/paginacao/paginacao.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { Tarefa } from './interfaces/tarefa.interface';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { TarefasTabelaComponent } from './components/tarefas-tabela/tarefas-tabela.component';
import { AdicionarTarefaFormComponent } from './components/adicionar-tarefa-form/adicionar-tarefa-form.component';
@Component({
  selector: 'to-do-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginacaoComponent,
    ToastComponent,
    HeaderComponent,
    FooterComponent,
    TarefasTabelaComponent,
    AdicionarTarefaFormComponent,
  ],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoListComponent implements OnInit {
  @ViewChild('toast') toastComponent?: ToastComponent;

  private _tarefas = signal<Tarefa[]>([]);
  private _paginaAtual = signal<number>(1);
  private _itensPorPagina = signal<number>(4);

  public opcoesItensPorPagina: number[] = [4, 8, 16, 32];

  tarefas = this._tarefas.asReadonly();
  paginaAtual = this._paginaAtual.asReadonly();
  itensPorPagina = this._itensPorPagina.asReadonly();

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      localStorage.setItem('tarefas', JSON.stringify(this._tarefas()));
    });
  }

  ngOnInit(): void {
    const tarefasPadrao: Tarefa[] = [
      {
        id: 1,
        nome: 'Falar com o Filipe Zuzarte',
        dataCriacao: new Date('2023-10-10T20:00:00'),
        concluida: false,
      },
      {
        id: 2,
        nome: 'Fazer deploy do projeto',
        dataCriacao: new Date('2023-10-10T19:00:00'),
        concluida: false,
      },
      {
        id: 3,
        nome: 'Fazer a folha de horas',
        dataCriacao: new Date('2023-10-10T18:00:00'),
        concluida: false,
      },
    ];
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
      this._tarefas.set(
        JSON.parse(tarefasSalvas).map((t: any) => ({
          ...t,
          dataCriacao: new Date(t.dataCriacao),
          dataConclusao: t.conclusao ? new Date(t.conclusao) : undefined,
        }))
      );
    } else {
      this._tarefas.set(tarefasPadrao);
    }

    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  tarefasPaginadas = computed(() => {
    const inicio = (this._paginaAtual() - 1) * this._itensPorPagina();
    const fim = inicio + this._itensPorPagina();
    return this._tarefas().slice(inicio, fim);
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this._tarefas().length / this._itensPorPagina()))
  );
  totalTarefas = computed(() => this._tarefas().length);

  onItensPorPaginaChange(novoValor: number): void {
    this._itensPorPagina.set(novoValor);
    this._paginaAtual.set(1);
  }

  adicionarTarefa(texto: string): void {
    try {
      const tarefasAtuais = this._tarefas();
      const novoId = tarefasAtuais.length ? Math.max(...tarefasAtuais.map((t) => t.id)) + 1 : 1;
      const nova: Tarefa = {
        id: novoId,
        nome: texto,
        dataCriacao: new Date(),
        concluida: false,
      };
      this._tarefas.set([nova, ...tarefasAtuais]);
      this._paginaAtual.set(1);
      this.toastComponent?.show('Tarefa adicionada', 'success');
    } catch {
      this.toastComponent?.show('Não foi possível adicionar a tarefa', 'danger');
    }
  }

  concluirTarefa(tarefa: Tarefa): void {
    try {
      const tarefasAtualizadas = this._tarefas().map((t) =>
        t.id === tarefa.id
          ? {
              ...t,
              concluida: !t.concluida,
              dataConclusao: t.concluida ? undefined : new Date(),
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
    const atualizadas = this._tarefas().filter((t) => t.id !== id);
    this._tarefas.set(atualizadas);
    const totalPaginasAtual = Math.max(1, Math.ceil(atualizadas.length / this._itensPorPagina()));
    this._paginaAtual.set(Math.min(this._paginaAtual(), totalPaginasAtual));
    this.toastComponent?.show('Tarefa excluída', 'success');
  }

  paginaAnterior(): void {
    if (this._paginaAtual() > 1) this._paginaAtual.update((p) => p - 1);
  }

  proximaPagina(): void {
    if (this._paginaAtual() < this.totalPaginas()) this._paginaAtual.update((p) => p + 1);
  }
}
