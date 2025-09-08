import { Injectable, signal } from '@angular/core';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _idCounter = 0;
  public toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', duration = 5000) {
    const id = ++this._idCounter;
    const toast: Toast = { id, message, type };
    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
