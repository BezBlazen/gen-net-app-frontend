import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { Person } from '../../../models/person.model';
import { JsonPipe } from '@angular/common';
import { EntityPresentationComponent, PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-person-view',
  imports: [
    EntityPresentationComponent,
    FormsModule,
    FormlyModule,
  ],
  templateUrl: './person-view.component.html',
  styleUrl: './person-view.component.scss'
})
export class PersonViewComponent extends EntityPresentationComponent {
  // --------------------------------
  // [variables]
  @Input() projectId?: string;
  @Input() personId?: string;
  @Output() onDeleted = new EventEmitter<void>();
  // [variables]
  // --------------------------------
  // [variables] Subscriptions
  private personSubscription?: Subscription;
  // [variables] Subscriptions
  // --------------------------------
  // [variables] Formly
  // Create
  modelCreate: Person = {};
  formCreate = new FormGroup({});
  optionsCreate: FormlyFormOptions = {};
  fieldsCreate: FormlyFieldConfig[] = [
    {
      key: 'gender.type',
      type: 'input',
      props: {
        label: 'Gender',
        errorTitle: '6-64 chars',
      }
    },
  ];
  // Edit, View
  model: Person = {};
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'id',
      type: 'input',
      props: {
        label: 'Id',
        disabled: true
      }
    },
    {
      key: 'gender.type',
      type: 'input',
      props: {
        label: 'Gender',
        errorTitle: '6-64 chars',
      }
    },
    {
      key: 'createdAt',
      type: 'input',
      props: {
        label: 'Created at',
        disabled: true
      }
    },
  ];
  // [variables] Formly
  // --------------------------------
  // [events] EntityPresentation
  onDelete(): void {
    throw new Error('Method not implemented.');
  }
  onSave(): void {
    throw new Error('Method not implemented.');
  }
  onRefresh(): void {
    throw new Error('Method not implemented.');
  }
  onClose(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  onOk(): void {
    if (this.config.mode == PresentationViewMode.CREATE && this.modelCreate && this.form.valid) {
      this.dataService.doPostPerson(this.modelCreate, this.projectId).subscribe((success) => {
        if (success) {
          if (this.model?.id) {
            this.model = { ...this.dataService.getPerson(this.model?.id) }
          }
          this.dialogRef?.close();
        }
      });
    }
  }
  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  // [events] EntityPresentation
  // --------------------------------
  constructor(
    private dataService: DataService,
  ) {
    super();
  }
  getConfig(): PresentationUIConfig {
    const config: PresentationUIConfig = { 
      title: 'Person',
    };
    return config;
  }
  resetForm() {
    this.form.reset();
  }
  isCreateMode(): boolean {
    return this.config.mode == PresentationViewMode.CREATE;
  }
}
