import { Component, ElementRef, Output, ViewChild } from '@angular/core';
import { Project } from '../../../models/project.model';
import { DataService } from '../../../services/data.service';
import { EntitySelectorComponent, SelectorUIConfig } from '../../entity-selector/entity-selector.component';
import { BehaviorSubject } from 'rxjs';
import { ProjectViewComponent } from '../project-view/project-view.component';
import { PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';

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
  projects: Project[] = [];
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
    this.reloadProjects();
  }
  // [events]
  // --------------------------------
  constructor(
    private dataService: DataService
  ) {
    super();
    this.reloadProjects();
  }
  rereadProjects() {
    this.projects = this.dataService.getProjectsLocal() ?? [];
    if (!this.projects || this.projects.length == 0) {
      this.reloadProjects();
    } else {
      this.updateActiveItem();
    }
  }
  reloadProjects() {
    this.dataService.getProjects().subscribe((success) => {
      if (success) {
        this.projects = this.dataService.getProjectsLocal() ?? [];
      }
      this.updateActiveItem();
    });
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
  onInit() {
    this.reloadProjects();
  }
  onDeleteEmitted() {
    this.rereadProjects();
  }
  onAddEmitted() {
    this.rereadProjects();
  }
}
