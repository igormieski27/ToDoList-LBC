export interface Tarefa {
  id: number;
  nome: string;
  dataCriacao: Date;
  dataConclusao?: Date;
  concluida: boolean;
}