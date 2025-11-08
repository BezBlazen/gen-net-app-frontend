import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-base-view-dialog-layout',
  imports: [],
  templateUrl: './base-view-dialog-layout.component.html',
  styleUrl: './base-view-dialog-layout.component.scss'
})
export class BaseViewDialogLayoutComponent {
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() ok = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
