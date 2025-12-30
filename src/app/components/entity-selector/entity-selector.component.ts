import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SelectorUIConfig {
  title?: string;
  toolbar?: boolean;
  toolbar_top_border?: boolean;
  entity_view?: boolean;
  // buttons?: {
  //   close?: boolean;
  //   add?: boolean;
  //   delete?: boolean;
  //   refresh?: boolean;
  //   ok?: boolean;
  //   cancel?: boolean;
  // };
}
@Component({
  selector: 'app-entity-selector',
  imports: [],
  templateUrl: './entity-selector.component.html',
  styleUrl: './entity-selector.component.scss'
})
export class EntitySelectorComponent {
  @Input() dialogRef?: HTMLDialogElement;
  @Input() config: SelectorUIConfig = {
    title: '',
    toolbar: true,
    toolbar_top_border: true,
    entity_view: false,
    // buttons: {
    //   close: true,
    //   add: true,
    //   delete: true,
    //   refresh: true,
    //   ok: true,
    //   cancel: true,
    // }
  };
  // onClose(): void {
  //   if (this.dialogRef) {
  //     this.dialogRef.close();
  //   }
  // };
  // onAdd(): void {
  // };
  // onDelete(): void {
  // };
  // onRefresh(): void {
  // };
  // onOk(): void {
  // };
  // onCancel(): void {
  //   if (this.dialogRef) {
  //     this.dialogRef.close();
  //   }
  // };
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  @Output() ok = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
  }
  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }
}
