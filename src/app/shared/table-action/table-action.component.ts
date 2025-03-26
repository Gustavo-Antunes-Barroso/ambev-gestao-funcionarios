import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table-action.component.html',
  imports: [
    CommonModule
  ]
})
export class TableActionComponent {
  @Input() columns: { header: string; field: string }[] = [];
  @Input() data: any[] = [];
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<string>();

  edit(row: any): void {
    this.onEdit.emit(row);
  }

  delete(id: string): void {
    this.onDelete.emit(id);
  }
}
