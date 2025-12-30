import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-input',
  imports: [
    FormlyModule,
    NgIf,
    ReactiveFormsModule
  ],
  template: `
    <div class="form-group">
      <label *ngIf="props.label" [for]="id">
        {{ props.label }}
        <span *ngIf="props.required" class="required">*</span>
      </label>
      
      <input
        [id]="id"
        [type]="props.type || 'text'"
        [formControl]="formControl"
        [title]="getErrorTitle()"
        [class.error]="showError"
        (input)="onChange($event)"
        [checked]="props.type == 'checkbox' && formControl.value"
      >
    </div>
  `,
  styles: [`
    .form-group { display: flex; padding-top: 4px; }
    .form-group label { flex: 0 0 100px; font-size: 13px;}
    .form-group input { flex: 1; }
    .form-group input[type="checkbox"] {
      flex: 0;
      margin-left: 0;
    }
    .error { box-shadow: 0 0 5px red; }
    .required { color: red; }
  `]
})
export class FormlyFieldInputComponent extends FieldType<FieldTypeConfig> {
  getErrorTitle(): string {
    if (!this.showError || !this.formControl.errors) {
      return '';
    }
    return this.props['errorTitle'];
  }
  
  onChange(event: any): void {
    if (this.props['type'] == 'checkbox') {
      this.formControl.setValue(event.currentTarget.checked);
    } else if (this.formControl.value) {
    } else {
      this.formControl.setValue(undefined);
    }
  }
}
