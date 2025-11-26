import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Project } from '../../../models/project.model';
import { DataService } from '../../../services/data.service';
import { ViewMode } from '../../base-view/base-view.component';
import { ProjectViewComponent } from '../project-view/project-view.component';

@Component({
  selector: 'app-project-selector',
  imports: [ProjectViewComponent],
  templateUrl: './project-selector.component.html',
  styleUrl: './project-selector.component.scss'
})
export class ProjectSelectorComponent {
  isLoading = false;
  // --------------------------------
  // [var] Projects
  projectId?: string;
  // @Output() projectIdChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSelect = new EventEmitter<string>();
  projects: Project[] = [];
  readonly ViewMode = ViewMode;
  @ViewChild('dialogProjectNew') dialogProjectNew!: ElementRef<HTMLDialogElement>;
  // [var] Projects
  // --------------------------------
  constructor(
    private dataService: DataService
  ) {
    this.dataService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.dataService.projects$.subscribe(projects => {
      this.projects = projects;
      if (!this.isLoading) {
        if (projects != null && projects.length > 0) {
          const p = projects.find(project => project.id === this.projectId);
          if (p) {
            this.setProject(p);
          } else {
            this.setProject(projects[0]);
          }
        } else {
            this.setProject(undefined);
        }
      }
    });
  }
  setProject(project: Project | undefined) {
    this.projectId = project?.id;
    this.onSelect.emit(project?.id);
  }
  openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
  }
  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSelect.emit(value);
  }
}
