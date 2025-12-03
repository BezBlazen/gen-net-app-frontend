import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface PresentationUIConfig {
  title?: string;
  toolbar?: boolean;
}

@Component({
  selector: 'app-entity-presentation',
  imports: [],
  templateUrl: './entity-presentation.component.html',
  styleUrl: './entity-presentation.component.scss'
})
export class EntityPresentationComponent {
  @Input() dialogRef?: HTMLDialogElement;
  @Input() config: PresentationUIConfig = {
    title: '',
    toolbar: true,
  };
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  @Output() ok = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
