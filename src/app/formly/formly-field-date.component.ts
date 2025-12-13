import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

enum DatePrecision {
  Exactly = "=",
  Approximate = "~",
  Before = "<",
  After = ">",
  Range = "<>"
}

@Component({
  selector: 'formly-field-select',
  imports: [
    CommonModule,
    FormsModule,
    FormlyModule,
    NgIf,
    ReactiveFormsModule
  ],
  template: `
    <div class="form-group">
      <label *ngIf="props.label" [for]="getId(1)">
        {{ props.label }}
        <span *ngIf="props.required" class="required">*</span>
      </label>
      <div [formGroup]="dateForm">
        <select 
          formControlName="datePrecision"
          (change)="onChange($event)">
          @for (precision of datePrecisions; track precision) {
            <option [value]="precision">
              {{ precision }}
            </option>
          }
        </select>
        <input
          [id]="getId(1)"
          [type]="'text'"
          formControlName="date1"
          placeholder="dd.mm.yyyy"
          (input)="onChange($event)"
        >
        @if (datePrecision === DatePrecision.Range) {
        -
        <input
          [id]="getId(2)"
          [type]="'text'"
          formControlName="date2"
          placeholder="dd.mm.yyyy"
          (input)="onChange($event)"
        >
        }
      </div>
    </div>
  `,
  styles: [`
    .form-group { display: flex; padding-top: 4px; }
    .form-group label { flex: 0 0 100px; font-size: 13px;}
    .form-group input { width: 80px }
    .error { box-shadow: 0 0 5px red; }
    .required { color: red; }
  `]
})
export class FormlyFieldDateComponent extends FieldType<FieldTypeConfig> {
  datePrecisions = Object.values(DatePrecision);
  datePrecision: DatePrecision = DatePrecision.Exactly;
  readonly DatePrecision = DatePrecision;
  dateForm: FormGroup;

  constructor() {
    super();
    this.dateForm = new FormGroup({
      datePrecision: new FormControl(DatePrecision.Exactly),
      date1: new FormControl(''),
      date2: new FormControl('')
    });
  }
  getErrorTitle(): string {
    if (!this.showError || !this.formControl.errors) {
      return '';
    }
    return this.props['errorTitle'];
  }
  getId(index: number): string {
    return `${this.id}-${index}`;
  }
  get safeOptions(): any[] {
    const options = this.props.options;

    if (Array.isArray(options)) {
      return options;
    }

    return [];
  }
  onChange(event: any): void {
    const datePrecision = this.dateForm.get('datePrecision')?.value;
    this.datePrecision = datePrecision;
    const date1 = this.dateForm.get('date1')?.value;
    const date2 = this.dateForm.get('date2')?.value;
    if (date1 || date2) {
      this.formControl.setValue(this.encodeDateString(datePrecision, date1, date2));
    } else {
      this.formControl.setValue(undefined);
    }
  }
  ngOnInit() {
    const initialValue = this.field.defaultValue;
    if (initialValue) {
      const [datePrecision, date1, date2] = this.decodeDateString(initialValue);
      this.dateForm.setValue({
        datePrecision: datePrecision,
        date1: date1,
        date2: date2
      });
    }
  }

  encodeDateString = (datePrecision: string, date1: string, date2: string): string => {
    return JSON.stringify([datePrecision, date1, date2]);
  };

  decodeDateString = (combined: string): [string, string, string] => {
    const arr = JSON.parse(combined);
    return [arr[0], arr[1], arr[2]];
  };
}
