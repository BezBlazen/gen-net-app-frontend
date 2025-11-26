import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseViewComponent, ViewMode } from '../../base-view/base-view.component';
import { DataService } from '../../../services/data.service';
import { Person } from '../../../models/person.model';
import { BaseViewLayoutConfig, BaseViewLayoutMode } from '../../base-view-layout/base-view-layout.component';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { BaseViewPageLayoutComponent } from '../../base-view-page-layout/base-view-page-layout.component';
import { BaseViewDialogLayoutComponent } from '../../base-view-dialog-layout/base-view-dialog-layout.component';

@Component({
  selector: 'app-person-view',
  imports: [
    BaseViewDialogLayoutComponent,
    BaseViewPageLayoutComponent,
    FormsModule,
    FormlyModule
  ],
  templateUrl: './person-view.component.html',
  styleUrl: './person-view.component.scss'
})
export class PersonViewComponent extends BaseViewComponent {
  emptyPerson: Person = { title: '' };
  model?: Person;
  @Input() set person(value: Person) {
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
  constructor(
    private dataService: DataService,
  ) {
    super();
  }
  getDialogTitle() {
    if (this.viewMode == ViewMode.CREATE) {
      return 'Create Person';
    } else {
      return 'Person: ' + this.model?.title;
    }

  }
  override onClose(): void {
    this.resetForm();
    this.dialogRef?.close();
  }
  override onOk(): void {
    if (this.model && this.form.valid) {
      if (this.viewMode == ViewMode.CREATE) {
        this.dataService.doPostPerson(this.model).subscribe((success) => {
          if (success) {
            this.resetForm();
            this.dialogRef?.close();
          }
        });
      } else if (this.viewMode == ViewMode.EDIT) {
        this.dataService.doPutPerson(this.model).subscribe((success) => {
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
        this.dataService.doPutPerson(this.model).subscribe((success) => {
          if (success) {
            this.resetForm();
            this.dialogRef?.close();
          }
        });
      }
    }
  }
  override onDelete(): void {
    // if (this.model && this.form.valid) {
    //   if (this.viewMode == ViewMode.EDIT) {
    //     let isConfirmed = confirm("Delete person: '" + this.model?.title + "' ?");
    //     if (isConfirmed) {
    //       this.dataService.doDeletePerson(this.model).subscribe((success) => {
    //         if (success) {
    //           this.resetForm();
    //           this.dialogRef?.close();
    //           this.onDeleted.emit();
    //         }
    //       });
    //     }
    //   }
    // }
  }
  ngOnInit() {
    if (this.dialogRef != null) {
      this.baseConfig.mode = BaseViewLayoutMode.DIALOG;
    }
    if (this.viewMode == ViewMode.CREATE) {
      this.model = this.emptyPerson;
    }
  }
  isViewModeCreate() {
    return this.viewMode == ViewMode.CREATE;
  }
  resetForm() {
    this.form.reset();
  }
}
