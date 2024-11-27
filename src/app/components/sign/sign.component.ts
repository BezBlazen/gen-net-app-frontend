import { Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountRole } from '../../models/account.model';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [MatTabsModule, MatDialogActions, MatDialogContent, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss'
})


export class SignComponent {
  readonly dialogRef = inject(MatDialogRef<SignComponent>);
  authInProgress : boolean = false;
  signInForm: FormGroup;
  signUpForm: FormGroup;
  selectedIndex = 0;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.authService.authInProgress$.subscribe(authInProgress => {this.authInProgress = authInProgress;});
    this.signInForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.signUpForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onClose() {
    this.dialogRef.close();
  }
  onSignIn() : void {
    if (this.signInForm.valid) {
      this.authService.postSignIn(this.signInForm.controls["username"].value, this.signInForm.controls["password"].value)
        .subscribe((account) => {
          if (account?.data?.role == AccountRole.User) {
            this.router.navigate(['/app']);
            this.onClose();
          }
        });
    }    
  }
  onSignUp() : void {
    if (this.signUpForm.valid && this.signUpForm.controls["password"].value == this.signUpForm.controls["confirmPassword"].value) {
      this.authService.postSignUp(this.signUpForm.controls["username"].value, this.signUpForm.controls["password"].value)
        .subscribe((account) => {
          if (account?.data?.role == AccountRole.User) {
            this.signInForm.reset();
            this.signInForm.controls["username"].setValue(account?.data?.username);
            this.selectedIndex = 0;
          }
        });
    }
  }  
}

