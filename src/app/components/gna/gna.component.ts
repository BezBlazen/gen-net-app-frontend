import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { DataService } from '../../services/data.service';
import { Account, AccountRole } from '../../models/account.model';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-gna',
  imports: [
    CommonModule,
    FormsModule,
    FormlyModule,
    NgxSpinnerComponent,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet],
  templateUrl: './gna.component.html',
  styleUrl: './gna.component.scss'
})
export class GnaComponent {
  @ViewChild('dialogSignIn') dialogSignIn!: ElementRef<HTMLDialogElement>;
  @ViewChild('dialogSignUp') dialogSignUp!: ElementRef<HTMLDialogElement>;
  @ViewChild('dialogSpinner') dialogSpinner!: ElementRef<HTMLDialogElement>;
  isLoading = false;
  errorMessage: string | null = null;
  // --------------------------------
  // [var] Account
  account: Account | null = null;
  accountRoleEnum = AccountRole;
  // [var] Account
  // --------------------------------
  // [var] Projects
  projects: Project[] = [];
  // [var] Projects
  // --------------------------------
  // [var] SignForm
  signInForm = new FormGroup({});
  signInModel = { username: "", password: "" };
  signInOptions: FormlyFormOptions = {};
  signInFields: FormlyFieldConfig[] = [
    {
      key: 'username',
      type: 'input',
      props: {
        label: 'Login',
        required: true,
        errorTitle: '6-64 chars, start with a letter',
      }
    },
    {
      key: 'password',
      type: 'input',
      props: {
        type: 'password',
        label: 'Password',
        required: true,
        errorTitle: '6-64 chars',
      }
    },
  ];
  signUpForm = new FormGroup({});
  signUpModel = { username: "", password: "", passwordConfirm: "" };
  signUpOptions: FormlyFormOptions = {};
  signUpFields: FormlyFieldConfig[] = [{
    validators: {
      validation: [
        { name: 'passwordConfirmMatch', options: { errorPath: 'passwordConfirm' } },
      ],
    },
    fieldGroup: [
      {
        key: 'username',
        type: 'input',
        props: {
          label: 'Login',
          required: true,
          pattern: '^[a-zA-Z][a-zA-Z0-9_]{5,63}$',
          errorTitle: '6-64 chars, start with a letter',
        }
      },
      {
        key: 'password',
        type: 'input',
        props: {
          type: 'password',
          label: 'Password',
          required: true,
          pattern: '^.{6,64}$',
          errorTitle: '6-64 chars',
        }
      },
      {
        key: 'passwordConfirm',
        type: 'input',
        props: {
          type: 'password',
          label: 'Confirm',
          required: true,
          errorTitle: 'Match password',
        },
      },
    ],
  }
  ];
  // [var] SignForm
  // --------------------------------  
  openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
  }
  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }
  switchDialog(dialogClose: HTMLDialogElement, dialogOpen: HTMLDialogElement) {
    dialogClose.close();
    dialogOpen.showModal();
  }

  constructor(
    private dataService: DataService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.dataService.rereadAccount();    
    this.dataService.isSignInSuccess$.subscribe(success => {
      if (success) {
        // TODO Reset errors not working
        this.signInModel = { username: "", password: "" };
        this.closeDialog(this.dialogSignIn.nativeElement);
      }
    });
    this.dataService.isSignUpSuccess$.subscribe(success => {
      if (success) {
        // TODO Reset errors not working
        this.signInModel = { username: "", password: "" };
        this.signInModel = { username: this.signUpModel.username, password: "" };
        this.signUpModel = { username: "", password: "", passwordConfirm: "" };
        this.switchDialog(this.dialogSignUp.nativeElement, this.dialogSignIn.nativeElement);
      }
    });
    this.dataService.account$.subscribe(account => {
      this.account = account;
      this.dataService.doGetProjects();
    });
    this.dataService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
      if (this.isLoading) {
        this.spinner.show();
        this.dialogSpinner?.nativeElement.showModal();
      } else {
        this.spinner.hide();
        this.dialogSpinner?.nativeElement.close();
      }
    });
    this.dataService.errorMessage$.subscribe(errorMessage => {
      if (errorMessage) {
        this.showAlert(errorMessage);
      }
    });
    this.dataService.projects$.subscribe(projects => {
      this.projects = projects;
    });
  }
  ngAfterViewInit() {
    const dialogArray = document.querySelectorAll('dialog');
    dialogArray.forEach((element) => element.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isLoading) {
        e.preventDefault();
      }
    }));

  }
  onSignInFormSubmit() {
    if (this.signInForm.valid) {
      this.dataService.doPostSignIn(new Account(this.signInModel.username, this.signInModel.password));
    }
  }
  onSignUpFormSubmit() {
    if (this.signUpForm.valid) {
      this.dataService.doPostSignUp(new Account(this.signUpModel.username, this.signUpModel.password));
    }
  }
  onSignOut() {
    this.dataService.doPostSignOut();
  }
  onAccountMenuChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;

    if (selectedValue == "signOut") {
      this.onSignOut();
    }
    select.value = "default";
  }
  showAlert(message: string) {
    if (message !== null) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    }
  }
}

