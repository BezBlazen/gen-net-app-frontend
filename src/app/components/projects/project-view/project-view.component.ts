import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Project } from '../../../models/project.model';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { DataService } from '../../../services/data.service';
import { EntityPresentationComponent, PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-view',
  imports: [
    EntityPresentationComponent,
    FormsModule,
    FormlyModule
  ],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent extends EntityPresentationComponent {
  // --------------------------------
  // [variables]
  isLoading = false;
  @Input() projectId?: string;
  @Output() onAddEmitted = new EventEmitter<void>();
  @Output() onDeleteEmitted = new EventEmitter<void>();
  // [variables]
  // --------------------------------
  // [variables] Subscriptions
  private projectsSubscription?: Subscription;
  // [variables] Subscriptions
  // --------------------------------
  // [variables] Formly
  // Create
  modelCreate: Project = {};
  formCreate = new FormGroup({});
  optionsCreate: FormlyFormOptions = {};
  fieldsCreate: FormlyFieldConfig[] = [
    {
      key: 'title',
      type: 'input',
      props: {
        label: 'Title',
        required: true,
        errorTitle: '6-64 chars',
      }
    },
  ];
  // Edit, View
  model?: Project;
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
      }
    },
  ];
  // [variables] Formly
  // --------------------------------
  // [events] EntityPresentation
  onDelete(): void {
    if (this.model && this.form.valid) {
      let isConfirmed = confirm("Delete project: '" + this.model?.title + "' ?");
      if (isConfirmed) {
        this.dataService.doDeleteProject(this.model).subscribe((success) => {
          if (success) {
            this.resetForm();
            this.dialogRef?.close();
            this.onDeleteEmitted.emit();
          }
        });
      }
    }
  }
  onSave(): void {
    if (this.model && this.formCreate.valid) {
      this.dataService.doPutProject(this.model).subscribe((success) => {
        if (success) {
          if (this.model?.id) {
            this.model = { ...this.dataService.getProjectLocal(this.model?.id) }
          }
          this.dialogRef?.close();
        }
      });
    }
  }
  onRefresh(): void {
    this.reloadProjects();
  }
  onClose(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  onOk(): void {
    if (this.config.mode == PresentationViewMode.CREATE && this.modelCreate && this.form.valid) {
      this.dataService.doPostProject(this.modelCreate).subscribe((success) => {
        if (success) {
          if (this.model?.id) {
            this.model = { ...this.dataService.getProjectLocal(this.model?.id) }
          }
          this.dialogRef?.close();
          this.onAddEmitted.emit();
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
  // [constructor]
  constructor(
    private dataService: DataService
  ) {
    super();
  }
  ngOnInit() {
    // Allow subscriptions if PresentationViewMode not CREATE
    if (this.config.mode != PresentationViewMode.CREATE) {
      this.projectsSubscription = this.dataService.projects$.subscribe(projects => {
        this.rereadProject();
      });
    }
  }
  ngOnDestroy() {
    this.projectsSubscription?.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId']) {
      this.updateModel();
    }
  }
  // [constructor]
  // --------------------------------
  getConfig(): PresentationUIConfig {
    if (this.config) {
      return this.config
    }

    const config: PresentationUIConfig = {
      title: 'Project',
    };
    return config;
  }
  isCreateMode(): boolean {
    return this.config.mode == PresentationViewMode.CREATE;
  }
  rereadProject() {
    this.updateModel();
  }
  updateModel() {
    if (this.projectId) {
      this.model = { ...this.dataService.getProjectLocal(this.projectId) }
    } else {
      this.model = {};
    }
  }
  reloadProjects() {
    this.dataService.doGetProjects();
  }
  resetForm() {
    this.form.reset();
  }
}
