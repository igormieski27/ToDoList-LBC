import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Toast {
  id: number;
  mensagem: string;
  tipo: 'success' | 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  private _idCounter = 0;
  public toasts = signal<Toast[]>([]);

  show(mensagem: string, tipo: Toast['tipo'] = 'info', duracao = 5000) {
    const id = ++this._idCounter;
    const toast: Toast = { id, mensagem, tipo };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.remove(id), duracao);
  }

  remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  fecharClick(id: number) {
    this.remove(id);
  }
}
