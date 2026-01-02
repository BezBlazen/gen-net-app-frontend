import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { DaoPerson, GenderOptions, Name, NameForm, NamePart, NamePartType, NameTypeOptions, Person, PersonCreate } from '../../../models/person.model';
import { JsonPipe } from '@angular/common';
import { EntityPresentationComponent, PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { Subscription } from 'rxjs';
import { PersonNamesSelectorComponent } from "../../person-names/person-names-selector/person-names-selector.component";
import { PersonUtilsComponent } from '../person-utils/person-utils.component';
import { PersonNamesViewComponent } from '../../person-names/person-names-view/person-names-view.component';

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
  @Input() projectId?: string;
  @Input() personId?: string;
  @Output() onAddEmitted = new EventEmitter<void>();
  @Output() onSaveEmitted = new EventEmitter<void>();
  @Output() onDeleteEmitted = new EventEmitter<void>();
  initPersonAsStr: string = '';
  readonly NamePartType = NamePartType;
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
      },
      defaultValue: GenderOptions[0]?.value
    },
    {
      key: 'names.type',
      type: 'select',
      props: {
        label: 'Name type',
        options: NameTypeOptions
      },
      defaultValue: NameTypeOptions[0]?.value
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
  model: DaoPerson = {};
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  // fields: FormlyFieldConfig[] = [
  //   {
  //     key: 'id',
  //     type: 'input',
  //     props: {
  //       label: 'Id',
  //       disabled: true
  //     }
  //   },
  //   {
  //     key: 'gender.type',
  //     type: 'input',
  //     props: {
  //       label: 'Gender',
  //       errorTitle: '6-64 chars',
  //     }
  //   },
  //   {
  //     key: 'createdAt',
  //     type: 'input',
  //     props: {
  //       label: 'Created at',
  //       disabled: true
  //     }
  //   },
  // ];
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
      key: 'preferredName',
      type: 'input',
      props: {
        label: 'Name',
        disabled: true,
      },
    },
    {
      key: 'gender.type',
      type: 'select',
      props: {
        label: 'Gender',
        options: GenderOptions
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
            this.onDeleteEmitted.emit();
          }
        });
      }
    }
  }
  onSave(): void {
    if (this.model) {
      this.dataService.updatePerson(this.model).subscribe((success) => {
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
      });
    }
  }
  onUndo(): void {
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
              type: this.modelCreate.names?.type,
              nameForms: [
                {
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
      if (this.initPersonAsStr != '' && this.initPersonAsStr != JSON.stringify(this.model)) {
        console.warn('this.initPersonAsStr != JSON.stringify(this.model)')
        console.log(this.initPersonAsStr);
        console.log(JSON.stringify(this.model));
        // this.initPersonAsStr = JSON.stringify(this.model);
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
    this.model = this.personId ? this.dataService.getPersonLocal(this.personId) ?? {} : {};
    this.model.preferredName = this.getPreferredName(this.model);
    // Store initial preson state
    this.initPersonAsStr = JSON.stringify(this.model);
  }
  getPreferredName(person: Person | undefined) {
    return person ? PersonUtilsComponent.getPreferredName(person) : '';
  }
  getPersonNames(): Name[] {
    if (!this.model.names) {
      this.model.names = [];
    }
    return this.model.names;
  }
}
