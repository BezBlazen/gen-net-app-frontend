import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { DataService } from '../../services/data.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { PresentationUIConfig, PresentationViewMode } from '../entity-presentation/entity-presentation.component';
import { ProjectViewComponent } from '../projects/project-view/project-view.component';
import { Account, Project } from '../../models/api.model';
import { AccountRoleTypeApi } from '../../../api/model/accountRoleType';

@Component({
  selector: 'app-gna',
  imports: [
    CommonModule,
    FormsModule,
    FormlyModule,
    NgxSpinnerComponent,
    ProjectViewComponent,
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
  account?: Account;
  accountRoleType = AccountRoleTypeApi;
  // [var] Account
  // --------------------------------
  // [var] Projects
  projectId?: string;
  projectMenu = [{ id: 0, title: 'Tree', routerLink: ['./', 'tree'] }, { id: 1, title: 'Persons', routerLink: ['./', 'persons'] }, { id: 2, title: 'Relationships', routerLink: ['./', 'relationships'] }]
  projects: Project[] = [];
  projectCreateViewConfig: PresentationUIConfig = {
    mode: PresentationViewMode.CREATE,
    title: 'Create Project',
    toolbar: false
  };
  @ViewChild('dialogProjectNew') dialogProjectNew!: ElementRef<HTMLDialogElement>;
  // [var] Projects
  // --------------------------------
  // [variables] Subscriptions
  private activeProjectIdSubscription?: Subscription;
  private projectsSubscription?: Subscription;
  private accountSubscription?: Subscription;
  private isLoadingSubscription?: Subscription;
  private errorMessageSubscription?: Subscription;
  // [variables] Subscriptions
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
  onAddProject(): void {
    this.openDialog(this.dialogProjectNew.nativeElement);
  }
  constructor(
    private dataService: DataService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {


    this.dataService.errorMessage$.subscribe(errorMessage => {
      if (errorMessage) {
        this.showAlert(errorMessage);
      }
    });

  }
  ngOnInit() {
    this.isLoadingSubscription = this.dataService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
      if (this.isLoading) {
        this.spinner.show();
        this.dialogSpinner?.nativeElement.showModal();
      } else {
        this.spinner.hide();
        this.dialogSpinner?.nativeElement.close();
      }
    });
    this.errorMessageSubscription = this.dataService.errorMessage$.subscribe(errorMessage => {
      if (errorMessage) {
        this.showAlert(errorMessage);
      }
    });
    this.accountSubscription = this.dataService.account$.subscribe(account => {
      this.account = account;
      this.dataService.resetCache();
      if (!account) {
        this.router.navigate(['/', 'gna']);
      } else {
        this.dataService.getProjects();
        this.dataService.getDictUri();
      }
    });
    this.projectsSubscription = this.dataService.projects$.subscribe(projects => {
      this.projects = projects;
      this.dataService.actualizeActiveProjectId();
    });
    this.activeProjectIdSubscription = this.dataService.activeProjectId$.subscribe(projectId => {
      this.projectId = projectId;

    });
    this.reloadAccount();
    this.dataService.getDictUri();
  }
  ngOnDestroy() {
    this.isLoadingSubscription?.unsubscribe();
    this.errorMessageSubscription?.unsubscribe();
    this.activeProjectIdSubscription?.unsubscribe();
    this.projectsSubscription?.unsubscribe();
    this.accountSubscription?.unsubscribe();
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
      this.dataService.doSignIn({username: this.signInModel.username, password: this.signInModel.password}).subscribe(success => {
        if (success) {
          this.signInModel = { username: "", password: "" };
          this.closeDialog(this.dialogSignIn.nativeElement);
        }
      });
    }
  }
  onSignUpFormSubmit() {
    if (this.signUpForm.valid) {
      this.dataService.doSignUp({username: this.signUpModel.username, password: this.signUpModel.password}).subscribe(success => {
        if (success) {
          this.signInModel = { username: "", password: "" };
          this.signInModel = { username: this.signUpModel.username, password: "" };
          this.signUpModel = { username: "", password: "", passwordConfirm: "" };
          this.switchDialog(this.dialogSignUp.nativeElement, this.dialogSignIn.nativeElement);
        }
      });
    }
  }
  onSignOut() {
    this.dataService.doSignOut().subscribe();
  }
  onAccountMenuChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;

    if (selectedValue == "signOut") {
      this.onSignOut();
    }
    select.value = "default";
  }
  onSelectProject(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    this.dataService.setActiveProjectId(selectedValue);
  }
  showAlert(message: string) {
    if (message !== null) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    }
  }
  reloadProjects() {
    this.dataService.getProjects();
  }
  reloadAccount() {
    this.dataService.getAccount();
  }
  onAddEmitted() {
    this.reloadAccount();
  }
}

