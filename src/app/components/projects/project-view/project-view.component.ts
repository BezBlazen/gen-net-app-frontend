import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Project } from '../../../models/project.model';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { DataService } from '../../../services/data.service';
import { EntityPresentationComponent, PresentationUIConfig } from '../../entity-presentation/entity-presentation.component';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-project-view',
  imports: [
    EntityPresentationComponent,
    FormsModule,
    FormlyModule,
  ],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent extends EntityPresentationComponent {
  // --------------------------------
  // [variables]
  isLoading = false;
  emptyProject: Project = { title: '' };
  model?: Project;
  @Input() projectId?: string;
  @Output() onDeleted = new EventEmitter<void>();
  // [variables]
  // --------------------------------
  // [variables] Subscriptions
  private projectsSubscription?: Subscription;
  // private destroy$ = new Subject<void>();
  // [variables] Subscriptions
  // --------------------------------
  // [variables] Formly
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
  // [events]
  onDelete(): void {
    if (this.model && this.form.valid) {
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
  onSave(): void {
    if (this.model && this.form.valid) {
      this.dataService.doPutProject(this.model).subscribe((success) => {
        if (success) {
          if (this.model?.id) {
            this.model = { ...this.dataService.getProject(this.model?.id) }
          }
          this.dialogRef?.close();
        }
      });
    }
  }
  onRefresh(): void {
    this.reloadProjects();
  }
  // [events]
  // --------------------------------
  // [constructor]
  constructor(
    private dataService: DataService
  ) {
    super();


  }
  ngOnInit() {
    // Allow subasiptions if not dialog
    if (!this.dialogRef) {
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
    const config: PresentationUIConfig = {
      title: 'Project',
    };
    return config;
  }
  rereadProject() {
    this.updateModel();
  }
  updateModel() {
    if (this.projectId) {
      this.model = { ...this.dataService.getProject(this.projectId) }
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
