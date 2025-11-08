import { Component, Directive, Input, TemplateRef, ViewChild } from '@angular/core';
import { Project } from '../../models/project.model';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { BaseViewComponent, ViewMode } from '../base-view/base-view.component';
import { BaseViewLayoutComponent, BaseViewLayoutConfig, BaseViewLayoutMode } from '../base-view-layout/base-view-layout.component';
import { BaseViewDialogLayoutComponent } from '../base-view-dialog-layout/base-view-dialog-layout.component';
import { BaseViewPageLayoutComponent } from '../base-view-page-layout/base-view-page-layout.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../services/data.service';
import { JsonPipe } from '@angular/common';

export enum FormViewMode {
  CREATE,
  EDIT,
  VIEW
}
@Component({
  selector: 'app-project',
  imports: [
    // BaseViewComponent,
    BaseViewDialogLayoutComponent,
    BaseViewPageLayoutComponent,
    // BaseViewLayoutComponent,
    // JsonPipe,
    FormsModule,
    FormlyModule
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent extends BaseViewComponent {
  @Input() project?: Project = { title: '' };
  baseConfig: BaseViewLayoutConfig = {};
  createViewConfig: BaseViewLayoutConfig = { mode: BaseViewLayoutMode.DIALOG };
  form = new FormGroup({});
  // model = this.project ? this.project : {title: ''};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'id',
      type: 'input',
      props: {
        label: 'Id',
        disabled: true
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return this.isViewModeCreate();
        },
      },
    },
    {
      key: 'title',
      type: 'input',
      props: {
        label: 'Title',
        required: true,
        errorTitle: '6-64 chars',
      }
    },
    {
      key: 'createdAt',
      type: 'input',
      props: {
        label: 'Created at',
        disabled: true
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return this.isViewModeCreate();
        },
      }
    },
  ];
  override onClose(): void {
    this.dialogRef?.close();
  }
  override onOk(): void {
    if (this.project && this.form.valid) {
      if (this.viewMode == ViewMode.CREATE) {
        this.dataService.doPostProject(this.project).subscribe((success) => {
          if (success) {
            this.dialogRef?.close();
          }
        });
      } else if (this.viewMode == ViewMode.EDIT) {
        this.dataService.doPutProject(this.project).subscribe((success) => {
          if (success) {
            this.dialogRef?.close();
          }
        });
      }
    }
  }

  override onSave(): void {
    if (this.project && this.form.valid) {
      if (this.viewMode == ViewMode.EDIT) {
        this.dataService.doPutProject(this.project).subscribe((success) => {
          if (success) {
            this.dialogRef?.close();
          }
        });
      }
    }
  }
  override onDelete(): void {
    if (this.project && this.form.valid) {
      if (this.viewMode == ViewMode.EDIT) {
        this.dataService.doDeleteProject(this.project).subscribe((success) => {
          if (success) {
            this.dialogRef?.close();
          }
        });
      }
    }
  }

  constructor(
    private dataService: DataService,
    private spinner: NgxSpinnerService
  ) {
    super();
  }
  getDialogTitle() {
    if (this.project) {
      return 'Project: ' + this.project.title;
    } else {
      return 'Create Project';
    }
  }
  ngOnInit() {
    if (this.dialogRef != null) {
      this.baseConfig.mode = BaseViewLayoutMode.DIALOG;
      this.baseConfig.title = this.viewMode == ViewMode.CREATE ? 'Create Project' : 'Edit Project';
      if (this.project) {
        this.baseConfig.title += this.project.title + ": " + this.project.title;
      }
      this.baseConfig.showCloseButton = true;
    }
    // if (this.project) {
    //   this.baseConfig.title
    //   if (this.viewMode == ViewMode.CREATE) {
    //     this.baseConfig = {
    //       title: 'Create Project',
    //       showDeleteButton: false,
    //       showSaveButton: true,
    //       showCloseButton: true,
    //     };
    //   }
    // }
    // this.baseConfig = {
    //   title: 'Project',
    //   showDeleteButton: this.viewMode == ViewMode.EDIT,
    //   showSaveButton: this.viewMode == ViewMode.EDIT || this.viewMode == ViewMode.CREATE,
    //   showCloseButton: this.dialogRef != null,
    // }
  }
  isViewModeCreate() {
    return this.viewMode == ViewMode.CREATE;
  }
}
