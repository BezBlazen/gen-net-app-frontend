import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyFieldInputComponent } from './formly/formly-field-input.component';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormlyFieldSelectComponent } from './formly/formly-field-select.component';
import { FormlyFieldDateComponent } from './formly/formly-field-date.component';
import { provideEnvironmentNgxMask } from 'ngx-mask';

export function passwordConfirmMatchValidator(control: AbstractControl) {
  const { password, passwordConfirm } = control.value;

  if (!passwordConfirm || !password) {
    return null;
  }

  if (passwordConfirm === password) {
    return null;
  }

  return { fieldMatch: { message: 'Password Not Matching' } };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideEnvironmentNgxMask(),
    importProvidersFrom(
      BrowserAnimationsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot({
        validators: [
          { name: 'passwordConfirmMatch', validation: passwordConfirmMatchValidator },
        ],
        types: [
          { name: 'input', component: FormlyFieldInputComponent },
          { name: 'select', component: FormlyFieldSelectComponent },
          { name: 'date', component: FormlyFieldDateComponent },
        ]
      }),
      NgxSpinnerModule.forRoot({ /* global config here */ })
    )
  ]
};
