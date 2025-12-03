import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { Person } from '../../../models/person.model';
import { JsonPipe } from '@angular/common';
import { EntityPresentationComponent, PresentationUIConfig } from '../../entity-presentation/entity-presentation.component';

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
  emptyPerson: Person = {};
  model?: Person;
  @Input() projectId?: string;
  @Input() set person(value: Person) {
    this.model = { ...value }
  }
  @Output() onDeleted = new EventEmitter<void>();
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
  // [variables]
  // --------------------------------
  // [events]
  onDelete(): void {
  }
  onRefresh(): void {
    // this.reloadProjects();
  }
  // [events]
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
}
