import { Component, ElementRef, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
// import { Project } from '../../../models/project.model';
import { DataService } from '../../../services/data.service';
import { EntitySelectorComponent, SelectorUIConfig } from '../../entity-selector/entity-selector.component';
import { BehaviorSubject } from 'rxjs';
import { ProjectViewComponent } from '../project-view/project-view.component';
import { PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { Project } from '../../../models/api.model';

@Component({
  selector: 'app-project-selector',
  imports: [
    EntitySelectorComponent,
    ProjectViewComponent
  ],
  templateUrl: './project-selector.component.html',
  styleUrl: './project-selector.component.scss'
})
export class ProjectSelectorComponent extends EntitySelectorComponent {
  // --------------------------------
  // [variables]
  @Input() projects: Project[] = [];
  // projects: Project[] = [];
  projectId?: string;
  projectCreateViewConfig: PresentationUIConfig = {
    mode: PresentationViewMode.CREATE,
    title: 'Create Project',
    toolbar: false
  };
  @ViewChild('dialogProjectNew') dialogProjectNew!: ElementRef<HTMLDialogElement>;
  // [variables]
  // --------------------------------
  // [events]
  onAdd(): void {
    this.openDialog(this.dialogProjectNew.nativeElement);
  }
  onRefresh(): void {
    this.dataService.getProjects();
  }
  // [events]
  // --------------------------------
  constructor(
    private dataService: DataService
  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects']) {
      this.updateActiveItem();
    }
  }
  updateActiveItem() {
    const p = this.projects ? this.projects.find(project => project.id === this.projectId) : undefined;
    if (!p) {
      this.projectId = (this.projects ?? []).length > 0 ? this.projects[0].id : undefined;
    }
  }
  getConfig(): SelectorUIConfig {
    const config: SelectorUIConfig = {
      title: 'Select Project',
    };
    return config;
  }
  setSelectedProjectId(id: string | undefined) {
    this.projectId = id;
  }
}
