import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../models/project.model';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { BaseViewComponent, ViewMode } from '../base-view/base-view.component';
import { BaseViewLayoutConfig, BaseViewLayoutMode } from '../base-view-layout/base-view-layout.component';
import { BaseViewDialogLayoutComponent } from '../base-view-dialog-layout/base-view-dialog-layout.component';
import { BaseViewPageLayoutComponent } from '../base-view-page-layout/base-view-page-layout.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../services/data.service';

export enum FormViewMode {
  CREATE,
  EDIT,
  VIEW
}
@Component({
  selector: 'app-project',
  imports: [
    BaseViewDialogLayoutComponent,
    BaseViewPageLayoutComponent,
    FormsModule,
    FormlyModule
  ],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent extends BaseViewComponent {
  emptyProject: Project = { title: '' };
  model?: Project;
  @Input() set project(value: Project) {
    this.model = { ...value }
  }
  @Output() onDeleted = new EventEmitter<void>();
  baseConfig: BaseViewLayoutConfig = {};
  createViewConfig: BaseViewLayoutConfig = { mode: BaseViewLayoutMode.DIALOG };
  form = new FormGroup({});
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
    this.resetForm();
    this.dialogRef?.close();
  }
  override onOk(): void {
    if (this.model && this.form.valid) {
      if (this.viewMode == ViewMode.CREATE) {
        this.dataService.doPostProject(this.model).subscribe((success) => {
          if (success) {
            this.resetForm();
            this.dialogRef?.close();
          }
        });
      } else if (this.viewMode == ViewMode.EDIT) {
        this.dataService.doPutProject(this.model).subscribe((success) => {
          if (success) {
            this.resetForm();
            this.dialogRef?.close();
          }
        });
      }
    }
  }

  override onSave(): void {
    if (this.model && this.form.valid) {
      if (this.viewMode == ViewMode.EDIT) {
        this.dataService.doPutProject(this.model).subscribe((success) => {
          if (success) {
            this.resetForm();
            this.dialogRef?.close();
          }
        });
      }
    }
  }
  override onDelete(): void {
    if (this.model && this.form.valid) {
      if (this.viewMode == ViewMode.EDIT) {
        let isConfirmed = confirm("Delete project: '" + this.model?.title + "' ?");
        if (isConfirmed) {
          this.dataService.doDeleteProject(this.model).subscribe((success) => {
            if (success) {
              this.resetForm();
              this.dialogRef?.close();
              this.onDeleted.emit();
            }
          });
        }
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
    if (this.viewMode == ViewMode.CREATE) {
      return 'Create Project';
    } else {
      return 'Project: ' + this.model?.title;
    }

  }
  ngOnInit() {
    if (this.dialogRef != null) {
      this.baseConfig.mode = BaseViewLayoutMode.DIALOG;
    }
    if (this.viewMode == ViewMode.CREATE) {
      this.model = this.emptyProject;
    }
  }
  isViewModeCreate() {
    return this.viewMode == ViewMode.CREATE;
  }
  resetForm() {
    this.form.reset();
  }
}
