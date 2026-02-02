import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EntityPresentationComponent, PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { FactApi } from '../../../../api/model/fact';
import { DataService } from '../../../services/data.service';
import { JsonPipe } from '@angular/common';
import { FactLocal } from '../../../models/person.model';

@Component({
  selector: 'app-person-fact-view',
  imports: [
    EntityPresentationComponent,
    FormsModule,
    FormlyModule,
    JsonPipe
  ],
  templateUrl: './person-fact-view.component.html',
  styleUrl: './person-fact-view.component.scss'
})
export class PersonFactViewComponent extends EntityPresentationComponent {
  // --------------------------------
  // [variables]
  @Input() factLocal?: FactLocal;
  @ViewChild('dialogRef') dialogFact!: ElementRef<HTMLDialogElement>;
  @Output() onAddEvent = new EventEmitter<FactLocal>();
  @Output() onSaveEvent = new EventEmitter<FactLocal>();
  isPreferredReadOnly: boolean = false;
  // [variables]
  // --------------------------------
  // [variables] Formly
  model: FactApi = {};
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'type',
      type: 'select',
      props: {
        label: 'Fact type',
      },
      hooks: {
        onInit: (field) => {
          const factTypes = this.dataService.getDictUriPersonFactTypesOption();
          field.props!.options = factTypes;
          if (factTypes && factTypes?.length > 0 && !field.defaultValue) {
            field.defaultValue = factTypes[0].value;
            field.formControl?.setValue(field.defaultValue);
          }
        }
      },
    },
    {
      key: 'date.formal',
      type: 'date',
      props: {
        label: 'Date',
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
    if (true) {
      if (this.model && this.form.valid) {
        if (this.config.mode == PresentationViewMode.CREATE) {
          this.onAddEvent.emit({index: undefined, fact: this.model});
        } else {
          this.onSaveEvent.emit({index: this.factLocal?.index, fact: this.model});
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
  constructor(
    private dataService: DataService
  ) {
    super();
  }
  getConfig(): PresentationUIConfig {
    const config: PresentationUIConfig = {
      title: this.config.mode == PresentationViewMode.CREATE ? 'Create Fact' : "Edit Fact",
      // mode: this.config.mode,
    };
    return config;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['factLocal']) {
      this.model = {... this.factLocal?.fact};
    }
  }
}
