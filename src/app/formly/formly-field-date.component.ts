import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

export enum DatePrecision {
  Exactly = '=',
  Approximate = '~',
  Before = '<',
  After = '>',
  Between = '/'
}

@Component({
  selector: 'formly-field-date',
  imports: [
    CommonModule,
    FormsModule,
    FormlyModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="form-group">
      <label *ngIf="props.label" [for]="getId(0)">
        {{ props.label }}
        <span *ngIf="props.required" class="required">*</span>
      </label>
      <div class="date-field">
        <select 
          [formControl]="precisionControl"
          class="form-control">
            @for (precision of precisionOptions; track precision) {
              <option [value]="precision.value">
                {{ precision.label }}
              </option>
            }
        </select>
        <input 
          [id]="getId(0)"
          type="text"
          style="display: none;"
          [formControl]="formControl">
        @if (showFirstDate) {
        <input 
          [id]="getId(1)"
          name="date1"
          type="text"
          [formControl]="date1Control"
          placeholder="YYYY-MM-DD"
          class="form-control"
          [class.is-invalid]="showError"
          (blur)="onBlurMethod($event)">
        }
        @if (showSecondDate) {
        <input 
          [id]="getId(2)"
          name="date2"
          type="text"
          [formControl]="date2Control"
          placeholder="YYYY-MM-DD"
          class="form-control"
          [class.is-invalid]="showError"
          (blur)="onBlurMethod($event)">
        }
      </div>
    </div>
  `,
  styles: [`
    .form-group { display: flex; padding-top: 4px; }
    .form-group label { flex: 0 0 100px; font-size: 13px;}
    .form-group input { width: 75px }
    .form-group input::placeholder { font-size: 11px; }
    .error { box-shadow: 0 0 5px red; }
    .required { color: red; }
  `]
})
export class FormlyFieldDateComponent extends FieldType<FieldTypeConfig> {
  private readonly DATE_REGEX = /^\d{4}(-\d{2}){0,2}$/;
  private valueSubscription?: Subscription;

  precisionOptions = [
    { value: DatePrecision.Exactly, label: 'Exactly' },
    { value: DatePrecision.Approximate, label: 'Approximate' },
    { value: DatePrecision.Before, label: 'Before' },
    { value: DatePrecision.After, label: 'After' },
    { value: DatePrecision.Between, label: 'Between' }
  ];

  precisionControl = new FormControl(DatePrecision.Exactly);
  date1Control = new FormControl('');
  date2Control = new FormControl('');

  get showFirstDate(): boolean {
    return this.precisionControl.value != null && [DatePrecision.Exactly, DatePrecision.Approximate, DatePrecision.After, DatePrecision.Between,].includes(this.precisionControl.value);
  }
  get showSecondDate(): boolean {
    return this.precisionControl.value != null && [DatePrecision.Before, DatePrecision.Between,].includes(this.precisionControl.value);
  }
  getId(index: number): string {
    return `${this.id}-${index}`;
  }
  constructor() {
    super();
    this.setupValueChanges();
    this.initializeFromModel();
  }
  ngOnInit() {
    this.valueSubscription = this.formControl.valueChanges.subscribe(value => {
      // console.log('Value changed:', value);
    });
  }

  ngOnDestroy() {
    if (this.valueSubscription) {
      this.valueSubscription.unsubscribe();
    }
  }

  private setupValueChanges(): void {
    this.precisionControl.valueChanges.subscribe(() => {
      this.updateModelValue();
    });

    this.date1Control.valueChanges.subscribe(() => {
      this.updateModelValue();
    });

    this.date2Control.valueChanges.subscribe(() => {
      this.updateModelValue();
    });
  }

  private initializeFromModel(): void {
    const dateStrValue: string | undefined = this.formControl?.value;
    if (dateStrValue && dateStrValue != "") {
      const regexSingleDate = "/^((A?\d{4}(-\d{2}){0,2})|(\d{4}(-\d{2}){0,2}/\d{4}(-\d{2}){0,2}))$/";
      if (!dateStrValue.match(regexSingleDate)) {
        throw new Error("Can't parse date");
      }
      throw new Error("Perser not defined yet");
    } else {
      this.precisionControl.setValue(DatePrecision.Exactly);
      this.date1Control.setValue('');
      this.date2Control.setValue('');
    }
  }
  onBlurMethod(event: Event): void {
    let dateString = (<HTMLInputElement>event.target).value;
    let dateResult: string | null = dateString ? this.parseDate(dateString) : null;
    switch ((<HTMLInputElement>event.target).name) {
      case 'date1':
        this.date1Control.setValue(dateResult);
        break;
      case 'date2':
        this.date2Control.setValue(dateResult);
        break;
    }
    this.updateModelValue();
  }

  private updateModelValue(): void {
    const precision = this.precisionControl ? this.precisionControl.value : null;
    const date1 = this.date1Control.value ? this.parseDate(this.date1Control.value) : null;
    const date2 = this.date2Control.value ? this.parseDate(this.date2Control.value) : null;
    let dateStrValue: string | null = null;
    switch (precision) {
      case DatePrecision.Exactly:
        dateStrValue = date1;
        break;
      case DatePrecision.Approximate:
        dateStrValue = date1 ? 'A' + date1 : null;
        break;
      case DatePrecision.Before:
        dateStrValue = date2 ? '/' + date2 : null;
        break;
      case DatePrecision.After:
        dateStrValue = date1 ? date1 + '/' : null;
        break;
      case DatePrecision.Between:
        dateStrValue = date1 || date2 ? (date1 ?? '') + '/' + (date2 ?? '') : null;
        break;
      default:
    }
    if (this.formControl) {
      this.formControl.setValue(dateStrValue ?? '');
    }
  }

  private parseDate(dateString: string): string | null {
    if (this.DATE_REGEX.test(dateString)) {
      return dateString;
    }
    let dateResult: string | null = null;

    let numStrArr: string[] = dateString.replaceAll(/\D+/g, " ").split(' ');
    let numArr = numStrArr.map((i) => Number(i));
    let d1: number | null = numArr.length > 0 ? numArr[0] : null;
    let d2: number | null = numArr.length > 0 ? numArr[1] : null;
    let d3: number | null = numArr.length > 0 ? numArr[2] : null;
    let yId: number | null = null;
    let mId: number | null = null;
    let dId: number | null = null;

    if (d1) {
      if (d3) {
        if (d1 <= 31 && d3 > 31) {
          yId = d3;
          dId = d1;
        } else {
          yId = d1;
          dId = d3;
        }
      } else {
        yId = d1;
      }
      mId = d2;
    }

    if (yId) {
      yId = yId < 100 ? yId + 1900 : yId;
      dateResult = String(yId).padStart(4, '0').slice(0, 4);
      if (mId) {
        mId = mId > 12 ? 12 : mId;
        dateResult = dateResult + '-' + String(mId).padStart(2, '0').slice(0, 2);
        if (dId) {
          dId = dId > 31 ? 31 : dId;
          dateResult = dateResult + '-' + String(dId).padStart(2, '0').slice(0, 2);
        }
      }
    }

    return dateResult;
  }

  override get showError(): boolean {
    return this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
  }
}