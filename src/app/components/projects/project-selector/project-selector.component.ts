import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Project } from '../../../models/project.model';
import { DataService } from '../../../services/data.service';
import { EntitySelectorComponent, SelectorUIConfig } from '../../entity-selector/entity-selector.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-project-selector',
  imports: [EntitySelectorComponent],
  templateUrl: './project-selector.component.html',
  styleUrl: './project-selector.component.scss'
})
export class ProjectSelectorComponent extends EntitySelectorComponent {
  // --------------------------------
  // [variables]
  isLoading = false;
  projects: Project[] = [];
  _projectId = new BehaviorSubject<string | undefined>(undefined);
  @Output() projectId = this._projectId.asObservable();
  // [variables]
  // --------------------------------
  // [events]
  onAdd(): void {
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
    this.dataService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.dataService.projects$.subscribe(projects => {
      if (!this.isLoading) {
        this.rereadProjects();
      }
    });
  }
  rereadProjects() {
    this.projects = this.dataService.getProjects();
    if (this.projects != null && this.projects.length > 0) {
      const p = this.projects.find(project => project.id === this._projectId.getValue());
      if (p) {
        this.setProject(p);
      } else {
        this.setProject(this.projects[0]);
      }
    } else {
      this.setProject(undefined);
    }
  }
  reloadProjects() {
    this.dataService.doGetProjects();
  }
  getConfig(): SelectorUIConfig {
    const config: SelectorUIConfig = {
      title: 'Select Project',
    };
    return config;
  }
  setProject(project: Project | undefined) {
    this._projectId.next(project?.id);
  }
  isActive(id: string | undefined) {
    return id && this._projectId.getValue() === id;
  }
  onInit() {
    this.rereadProjects();
    if (!this.projectId) {
      this.reloadProjects();
    }
  }
}
