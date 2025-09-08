import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() itemsPerPageOptions: number[] = [10, 20, 50];

  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newValue = Number(target.value);
    this.itemsPerPageChange.emit(newValue);
  }

  isPreviousPageDisabled(): boolean {
    return this.currentPage <= 1;
  }

  isNextPageDisabled(): boolean {
    return this.currentPage >= this.totalPages;
  }
}
