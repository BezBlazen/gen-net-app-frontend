import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { EntityPresentationComponent, PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { Subscription } from 'rxjs';
import { PersonNamesSelectorComponent } from "../../person-names/person-names-selector/person-names-selector.component";
import { PersonUtilsComponent } from '../person-utils/person-utils.component';
import { Name, NamePart, Person } from '../../../models/api.model';
import { PersonCreateLocal, PersonLocal } from '../../../models/person.model';
import { UriDtoApi } from '../../../../api/model/uriDto';
import { CommonApiUri } from '../../../models/common.model';

@Component({
  selector: 'app-person-view',
  imports: [
    EntityPresentationComponent,
    FormsModule,
    FormlyModule,
    PersonNamesSelectorComponent,
  ],
  templateUrl: './person-view.component.html',
  styleUrl: './person-view.component.scss'
})
export class PersonViewComponent extends EntityPresentationComponent {
  // --------------------------------
  // [variables]
  uriDict?: UriDtoApi[];
  @Input() projectId?: string;
  @Input() personId?: string;
  @Output() onAddEmitted = new EventEmitter<void>();
  @Output() onSaveEmitted = new EventEmitter<void>();
  @Output() onDeleteEmitted = new EventEmitter<void>();
  initPersonAsStr: string = '';
  mainTabs = [{ id: 0, label: 'General' }, { id: 1, label: 'Names' }, { id: 2, label: 'Events' }]
  mainTabId = 0;
  // [variables]
  // --------------------------------
  // [variables] Subscriptions
  private personSubscription?: Subscription;
  // [variables] Subscriptions
  // --------------------------------
  // [variables] Formly
  // Create
  modelCreate: PersonCreateLocal = {};
  formCreate = new FormGroup({});
  optionsCreate: FormlyFormOptions = {};
  fieldsCreate: FormlyFieldConfig[] = [
    {
      key: 'gender.type',
      type: 'select',
      props: {
        label: 'Gender',
      },
      hooks: {
        onInit: (field) => {
          const nameTypes = this.dataService.getDictUriGenderTypesOption();
          field.props!.options = nameTypes;
          if (nameTypes && nameTypes?.length > 0 && !field.defaultValue) {
            field.defaultValue = nameTypes[0].value;
            field.formControl?.setValue(field.defaultValue);
          }
        }
      },
    },
    {
      key: 'names.type',
      type: 'select',
      props: {
        label: 'Name type',
      },
      hooks: {
        onInit: (field) => {
          const nameTypes = this.dataService.getDictUriNameTypesOption();
          field.props!.options = nameTypes;
          if (nameTypes && nameTypes?.length > 0 && !field.defaultValue) {
            field.defaultValue = nameTypes[0].value;
            field.formControl?.setValue(field.defaultValue);
          }
        }
      },
    },
    {
      key: 'names.full',
      type: 'input',
      props: {
        label: 'Full name',
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
      key: 'date.birth',
      type: 'date',
      props: {
        label: 'Birth date',
      }
    },
    {
      key: 'date.death',
      type: 'date',
      props: {
        label: 'Death date',
      }
    },
  ];
  // Edit, View
  model: PersonLocal = {};
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'personApi.id',
      type: 'input',
      props: {
        label: 'Id',
        disabled: true
      }
    },
    {
      key: 'preferredName',
      type: 'input',
      props: {
        label: 'Name',
        disabled: true,
      },
    },
    {
      key: 'personApi.gender.type',
      type: 'select',
      props: {
        label: 'Gender',

      },
      hooks: {
        onInit: (field) => {
          const nameTypes = this.dataService.getDictUriGenderTypesOption();
          field.props!.options = nameTypes;
          if (nameTypes && nameTypes?.length > 0 && !field.defaultValue) {
            field.defaultValue = nameTypes[0].value;
            field.formControl?.setValue(field.defaultValue);
          }
        }
      },    
    },
  ];
  // [variables] Formly
  // --------------------------------
  // [events] EntityPresentation
  onDelete(): void {
    if (this.model.personApi) {
      let isConfirmed = confirm("Delete person: '" + this.model?.personApi?.id + "' ?");
      if (isConfirmed) {
        this.dataService.deletePerson(this.model.personApi).subscribe((success) => {
          if (success) {
            this.dialogRef?.close();
            this.onDeleteEmitted.emit();
          }
        });
      }
    }
  }
  onSave(): void {
    if (this.model.personApi) {
      this.dataService.updatePerson(this.model.personApi).subscribe((success) => {
        if (success) {
          this.onSaveEmitted.emit();
          this.dialogRef?.close();
        }
      });
    }
  }
  onRefresh(): void {
    if (this.personId) {
      this.dataService.getPerson(this.personId).subscribe((success) => {
        if (success) {
          this.rereadPerson();
        }
      });
    }
  }
  onUndo(): void {
    this.rereadPerson();
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
        let fullName = this.modelCreate.names?.full;
        if (this.modelCreate.names?.first) {
          firstNamePart = {
            type: CommonApiUri.NamePartTypeGiven,
            value: this.modelCreate.names?.first
          }
        }
        if (this.modelCreate.names?.last) {
          lastNamePart = {
            type: CommonApiUri.NamePartTypeSurname,
            value: this.modelCreate.names?.last
          }
        }

        if (firstNamePart || lastNamePart || fullName) {
          person.names = [
            {
              type: this.modelCreate.names?.type,
              nameForms: [
                {
                  fullText: fullName,
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
            this.onAddEmitted.emit();
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
    this.uriDict = this.dataService.getDictUriLocal();
    // Allow subscriptions if PresentationViewMode not CREATE
    if (this.config.mode != PresentationViewMode.CREATE) {
      this.personSubscription = this.dataService.persons$.subscribe(persons => {
        this.updateModel();
      });
    }
  }
  ngOnDestroy() {
    this.personSubscription?.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] || changes['personId']) {
      if (this.initPersonAsStr != '' && this.initPersonAsStr != JSON.stringify(this.model.personApi)) {
        console.warn('this.initPersonAsStr != JSON.stringify(this.model)')
        let isConfirmed = confirm("Save changes?");
        if (isConfirmed) {
          this.onSave();
        }
      }
    }
    if (changes['projectId']) {
      this.rereadPerson();
      this.mainTabId = 0;
    }
    if (changes['personId']) {
      this.rereadPerson();
    }

  }
  onClickMainTab(tabId: number) {
    this.mainTabId = tabId;
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
    this.model = {};
    this.model.personApi = this.personId ? this.dataService.getPersonLocal(this.personId) ?? {} : {};
    this.model.preferredName = this.getPreferredName(this.model.personApi);
    // Store initial preson state
    this.initPersonAsStr = JSON.stringify(this.model.personApi);
  }
  getPreferredName(person: Person | undefined) {
    return person ? PersonUtilsComponent.getPreferredName(person) : '';
  }
  getPersonNames(): Name[] {
    // if (!this.model.person?.names) {
    //   this.model.person.names = [];
    // }
    return this.model.personApi?.names ?? [];
  }
}
