export interface Toast {
  id: number;
  mensagem: string;
  tipo: 'success' | 'danger' | 'warning' | 'info';
  visivel: boolean;
}