import { Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account, AccountRole } from '../../models/account.model';
import { DataService } from '../../services/data.service';
import { ApiDataWrapper } from '../../services/api-data-wrapper';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [MatTabsModule, MatDialogActions, MatDialogContent, MatInputModule, MatButtonModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss'
})


export class SignComponent {
  readonly dialogRef = inject(MatDialogRef<SignComponent>);
  signInForm: FormGroup;
  signUpForm: FormGroup;
  selectedIndex = 0;
  account: ApiDataWrapper<Account> | null = null;
  signInAccount: ApiDataWrapper<Account> | null = null;
  signUpAccount: ApiDataWrapper<Account> | null = null;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router) {
    this.dataService.account$.subscribe(account => {
      this.account = account;
    });
    this.dataService.signInAccount$.subscribe(account => {
      if (this.signInAccount?.data == undefined && account?.data != undefined) {
          this.signInForm.reset();
          // this.router.navigate(['/app']);
          this.onClose();
      }
      this.signInAccount = account;
    });
    this.dataService.signUpAccount$.subscribe(account => {
      if (this.signUpAccount?.data == undefined && account?.data != undefined) {
          this.signInForm.reset();
          this.signInForm.controls["username"].setValue(account?.data?.username);
          this.selectedIndex = 0;
          this.signUpForm.reset();
      }
      this.signUpAccount = account;
    });

    this.signInForm = formBuilder.group({
      username: [this.signInAccount?.data?.username != undefined ? this.signInAccount?.data?.username : '', Validators.required],
      password: ['', Validators.required]
    });
    this.signUpForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onClose() {
    this.dataService.resetSignErrors();
    this.dialogRef.close();
  }
  onSignIn() : void {
    if (this.signInForm.valid) {
      this.dataService.postSignIn(this.signInForm.value);
    }    
  }
  onSignUp() : void {
    if (this.signUpForm.valid && this.signUpForm.controls["password"].value == this.signUpForm.controls["confirmPassword"].value) {
      this.dataService.postSignUp(this.signUpForm.value);
    }
  }  
}

