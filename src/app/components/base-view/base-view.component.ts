import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Directive, ElementRef, EventEmitter, Injectable, Input, Output, TemplateRef } from '@angular/core';
import { BaseViewLayoutConfig } from '../base-view-layout/base-view-layout.component';

export enum ViewMode {
  CREATE,
  EDIT,
  VIEW
}

@Component({
  selector: 'app-base-view',
  imports: [],
  templateUrl: './base-view.component.html',
  styleUrl: './base-view.component.scss'
})
export abstract class BaseViewComponent {
  @Input() viewMode: ViewMode = ViewMode.VIEW;
  @Input() dialogRef?: HTMLDialogElement;
  @Input() config: BaseViewLayoutConfig = {
    title: '',
    showDeleteButton: true,
    showSaveButton: true,
    showCloseButton: true,
    // viewMode: ViewMode.VIEW,
  };
  readonly ViewMode = ViewMode;
  abstract onOk(): void;
  abstract onSave(): void;
  abstract onDelete(): void;
  onClose(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  };
  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  };
}