import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { GenderOptions, NameForm, NamePart, NamePartType, Person, PersonCreate } from '../../../models/person.model';
import { JsonPipe } from '@angular/common';
import { EntityPresentationComponent, PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-person-view',
  imports: [
    EntityPresentationComponent,
    FormsModule,
    FormlyModule,
    JsonPipe
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
  readonly NamePartType = NamePartType;
  // [variables]
  // --------------------------------
  // [variables] Subscriptions
  private personSubscription?: Subscription;
  // [variables] Subscriptions
  // --------------------------------
  // [variables] Formly
  // Create
  modelCreate: PersonCreate = {};
  formCreate = new FormGroup({});
  optionsCreate: FormlyFormOptions = {};
  fieldsCreate: FormlyFieldConfig[] = [
    {
      key: 'gender.type',
      type: 'select',
      props: {
        label: 'Gender',
        options: GenderOptions
      }
    },
    {
      key: 'names.first',
      type: 'input',
      props: {
        label: 'First name',
      }
    },
    {
      key: 'names.last',
      type: 'input',
      props: {
        label: 'Last name',
      }
    },
    {
      key: 'dates.birth',
      type: 'date',
      props: {
        label: 'Birth date',
      }
    },
    {
      key: 'dates.death',
      type: 'date',
      props: {
        label: 'Death date',
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
    if (this.model) {
      let isConfirmed = confirm("Delete person: '" + this.model?.id + "' ?");
      if (isConfirmed) {
        this.dataService.deletePerson(this.model).subscribe((success) => {
          if (success) {
            this.dialogRef?.close();
            this.onDeleted.emit();
          }
        });
      }
    }
  }
  onSave(): void {
    if (this.model) {
      this.dataService.updatePerson(this.model).subscribe((success) => {
        if (success) {
          this.dialogRef?.close();
        }
      });
    }
  }
  onRefresh(): void {
    if (this.personId) {
      this.dataService.getPerson(this.personId).subscribe((success) => {
      });
    }
  }
  onClose(): void {
    this.resetForm();
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  onOk(): void {
    if (this.config.mode == PresentationViewMode.CREATE) {
      if (this.modelCreate && this.formCreate.valid) {
        const person: Person = {}
        if (this.modelCreate.gender?.type) {
          person.gender = {
            type: this.modelCreate.gender?.type
          }
        }
        let firstNamePart: NamePart | undefined = undefined;
        let lastNamePart: NamePart | undefined = undefined;
        if (this.modelCreate.names?.first) {
          firstNamePart = {
            type: NamePartType.GIVEN,
            value: this.modelCreate.names?.first
          }
        }
        if (this.modelCreate.names?.last) {
          lastNamePart = {
            type: NamePartType.SURNAME,
            value: this.modelCreate.names?.last
          }
        }
        if (firstNamePart || lastNamePart) {
          person.names = [
            {
              type: '',
              nameForms: [
                {
                  preferred: true,
                  parts: [firstNamePart, lastNamePart].filter(x => x != undefined) as NamePart[]
                }
              ]
            }
          ]
        }
        person.projectId = this.projectId;

        this.dataService.addPerson(person).subscribe((success) => {
          if (success) {
            this.dialogRef?.close();
            this.resetForm();
          }
        });
      }
    } else {
      throw new Error("Undefined yet");
    }
  }
  onCancel(): void {
    this.resetForm();
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
  ngOnInit() {
    // Allow subscriptions if PresentationViewMode not CREATE
    if (this.config.mode != PresentationViewMode.CREATE) {
      this.personSubscription = this.dataService.persons$.subscribe(persons => {
        this.updateModel()
      });
    }
  }
  ngOnDestroy() {
    this.personSubscription?.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId']) {
      this.projectId = changes['projectId'].currentValue;
      this.rereadPerson();
    }
    if (changes['personId']) {
      this.personId = changes['personId'].currentValue;
      this.rereadPerson();
    }

  }
  getConfig(): PresentationUIConfig {
    const config: PresentationUIConfig = {
      title: this.config.mode == PresentationViewMode.CREATE ? 'Create person' : "Person: ",
    };
    return config;
  }
  resetForm() {
    this.form.reset();
    this.formCreate.reset();
    if (this.config.mode == PresentationViewMode.CREATE) {
      this.modelCreate = {};
    }
  }
  isCreateMode(): boolean {
    return this.config.mode == PresentationViewMode.CREATE;
  }
  rereadPerson() {
    this.updateModel();
  }
  updateModel() {
    if (this.personId) {
      this.model = { ...this.dataService.getPersonLocal(this.personId) }
    } else {
      this.model = {};
    }
  }
}
