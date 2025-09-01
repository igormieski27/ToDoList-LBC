import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paginacao.component.html',
  styleUrl: './paginacao.component.scss'
})
export class PaginacaoComponent {
  @Input() paginaAtual: number = 1;
  @Input() totalPaginas: number = 1;
  @Input() itensPorPagina: number = 10;
  @Input() opcoesItensPorPagina: number[] = [10, 20, 50];

  @Output() paginaAnterior = new EventEmitter<void>();
  @Output() proximaPagina = new EventEmitter<void>();
  @Output() itensPorPaginaChange = new EventEmitter<number>();

  onItensPorPaginaChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const novoValor = Number(target.value);
    this.itensPorPaginaChange.emit(novoValor);
  }

  isPaginaAnteriorDisabled(): boolean {
    return this.paginaAtual <= 1;
  }

  isProximaPaginaDisabled(): boolean {
    return this.paginaAtual >= this.totalPaginas;
  }
}