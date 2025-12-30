import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-select',
  imports: [
    CommonModule,
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

      <select 
        [formControl]="formControl"
        [title]="getErrorTitle()"
        [class.error]="showError"
        [id]="id"
        >
      @for (option of safeOptions; track option) {
        <option [value]="option.value">
          {{ option.label }}
        </option>
      }
      </select>
    </div>
  `,
  styles: [`
    .form-group { display: flex; padding-top: 4px; }
    .form-group label { flex: 0 0 100px; font-size: 13px;}
    .form-group select { height: 21.2px}
    .error { box-shadow: 0 0 5px red; }
    .required { color: red; }
  `]
})
export class FormlyFieldSelectComponent extends FieldType<FieldTypeConfig> {
  getErrorTitle(): string {
    if (!this.showError || !this.formControl.errors) {
      return '';
    }
    return this.props['errorTitle'];
  }
  get safeOptions(): any[] {
    const options = this.props.options;
    
    if (Array.isArray(options)) {
      return options;
    }

    return [];
  }
}
