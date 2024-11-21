import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { Account } from '../../models/account.model';

export enum SignKind {
  Login,
  Registration
}

@Component({
  selector: 'app-sign-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatDialogContent, MatDialogActions, MatButtonToggleModule, ReactiveFormsModule, FormsModule, MatInputModule, MatDialogClose, MatButtonModule],
  templateUrl: './sign-dialog.component.html',
  styleUrl: './sign-dialog.component.scss'
})
export class SignDialogComponent {
  enumSignKind = SignKind;
  signKind = SignKind.Login;
  signForm: FormGroup;
  account: Account | undefined;
  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.signForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['']
    });
  }
  onChange($event: any) {
    this.signKind = $event.value;
    if ($event.value === SignKind.Registration) {
      this.signForm.controls["confirm_password"].setValidators([Validators.required]);
    } else {
      this.signForm.controls["confirm_password"].clearValidators()
    }
    this.signForm.controls["confirm_password"].updateValueAndValidity()
  }

  onSubmit():void {
    if (this.signKind==SignKind.Login) {
      console.log(this.signForm.value);
      this.dataService.postSignIn(this.signForm.controls["username"].value, this.signForm.controls["password"].value);
    } else {

    }
  }
}
