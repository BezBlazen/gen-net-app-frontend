import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-base-view-page-layout',
  imports: [],
  templateUrl: './base-view-page-layout.component.html',
  styleUrl: './base-view-page-layout.component.scss'
})
export class BaseViewPageLayoutComponent {
  // @Input() config: BaseViewLayoutConfig;
  @Output() delete = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}
