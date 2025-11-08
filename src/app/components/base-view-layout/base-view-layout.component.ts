import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

export enum BaseViewLayoutMode {
  DIALOG,
  PAGE
}
export interface BaseViewLayoutConfig {
  mode?: BaseViewLayoutMode;
  title?: string;
  // showDeleteButton?: boolean;
  // showDeleteButton?: boolean;
  showCloseButton?: boolean;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  showSaveButton?: boolean;
  showDeleteButton?: boolean;
}

@Component({
  selector: 'app-base-view-layout',
  imports: [],
  templateUrl: './base-view-layout.component.html',
  styleUrl: './base-view-layout.component.scss'
})
export class BaseViewLayoutComponent {
  @Input() config: BaseViewLayoutConfig = {
    // title: '',
    // showDeleteButton: false,
    // showSaveButton: false,
    // showCloseButton: true,
  };
  @Output() close = new EventEmitter<void>();
  readonly LayoutMode = BaseViewLayoutMode;
}
