import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EntityPresentationComponent, PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { DaoName, DaoNameForm, Name, NameForm, NamePartType, NameType, NameTypeOptions } from '../../../models/person.model';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-person-names-view',
  imports: [
    EntityPresentationComponent,
    FormsModule,
    FormlyModule,
  ],
  templateUrl: './person-names-view.component.html',
  styleUrl: './person-names-view.component.scss'
})
export class PersonNamesViewComponent extends EntityPresentationComponent {
  // --------------------------------
  // [variables]
  @Input() personName?: DaoName;
  @ViewChild('dialogPersonName') dialogPersonName!: ElementRef<HTMLDialogElement>;
  @Output() onAddEvent = new EventEmitter<DaoName>();
  @Output() onSaveEvent = new EventEmitter<DaoName>();
  isPreferredReadOnly: boolean = false;
  // [variables]
  // --------------------------------
  // [variables] Formly
  model: DaoNameForm = {};
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'preferred',
      type: 'input',
      props: {
        label: 'Preferred',
        type: 'checkbox',
        // disabled: this.isPreferredReadOnly,
      },
      expressions: {
        'props.disabled': (field: FormlyFieldConfig) => {
          return this.isPreferredReadOnly;
        }
      },
    },
    {
      key: 'type',
      type: 'select',
      props: {
        label: 'Name type',
        options: NameTypeOptions
      },
      defaultValue: NameTypeOptions[0]?.value
    },
    {
      key: 'full',
      type: 'input',
      props: {
        label: 'Full name',
      }
    },
    {
      key: 'first',
      type: 'input',
      props: {
        label: 'First name',
      }
    },
    {
      key: 'last',
      type: 'input',
      props: {
        label: 'Last name',
      }
    },
  ];
  // [variables] Formly
  // --------------------------------
  // [events] EntityPresentation
  onDelete(): void {
  }
  onClose(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  onOk(): void {
    // if (this.config.mode == PresentationViewMode.CREATE) {
    if (true) {
      if (this.model && this.form.valid) {
        const nameForm: NameForm = {}
        if (this.model.full) {
          nameForm.fullText = this.model.full;
        }
        if (this.model.first || this.model.last) {
          nameForm.parts = [];
          if (this.model.first) {
            nameForm.parts.push({
              type: NamePartType.GIVEN,
              value: this.model.first
            });
          }
          if (this.model.last) {
            nameForm.parts.push({
              type: NamePartType.SURNAME,
              value: this.model.last
            });
          }
        }
        const name: Name = { type: this.model.type, nameForms: [nameForm] };
        if (this.config.mode == PresentationViewMode.CREATE) {
        this.onAddEvent.emit({ index: this.model.preferred == true ? 0 : undefined, name: name });
        } else {
        this.onSaveEvent.emit({ index: this.model.preferred == true ? 0 : this.personName?.index, name: name });
        }
        if (this.dialogRef) {
          this.dialogRef.close();
        }
      }
    }
  }
  onCancel(): void {
    // this.form.reset();
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  // [events] EntityPresentation
  // --------------------------------
  isCreateMode(): boolean {
    return this.config.mode == PresentationViewMode.CREATE;
  }
  getConfig(): PresentationUIConfig {
    const config: PresentationUIConfig = {
      title: this.config.mode == PresentationViewMode.CREATE ? 'Create Name' : "Edit Name",
      // mode: this.config.mode,
    };
    return config;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personName']) {
      const newModel: DaoNameForm = {}
      newModel.preferred = this.personName?.index == 0;
      newModel.type = this.personName?.name.type;
      const nameForm: NameForm = this.personName?.name?.nameForms && this.personName?.name?.nameForms?.length > 0 ? this.personName?.name?.nameForms[0] : {};
      newModel.full = nameForm.fullText;
      newModel.first = nameForm.parts?.find(p => p.type == NamePartType.GIVEN)?.value;
      newModel.last = nameForm.parts?.find(p => p.type == NamePartType.SURNAME)?.value;
      this.model = Object.assign({}, this.model, newModel);
      this.isPreferredReadOnly = this.personName?.index == 0;
    }
  }
}
