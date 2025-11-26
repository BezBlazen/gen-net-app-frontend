import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Project } from '../../models/project.model';
import { ViewMode } from '../base-view/base-view.component';
import { ProjectViewComponent } from '../projects/project-view/project-view.component';
import { ProjectSelectorComponent } from '../projects/project-selector/project-selector.component';

@Component({
  selector: 'app-gna-projects',
  imports: [
    ProjectSelectorComponent,
    ProjectViewComponent
  ],
  templateUrl: './gna-projects.component.html',
  styleUrl: './gna-projects.component.scss'
})
export class GnaProjectsComponent {
  isLoading = false;
  // --------------------------------
  // [var] Projects
  projectId?: string;
  project?: Project;
  projects: Project[] = [];
  readonly ViewMode = ViewMode;
  @ViewChild('dialogProjectNew') dialogProjectNew!: ElementRef<HTMLDialogElement>;
  // [var] Projects
  // --------------------------------
  setProject(row: Project) {
    this.project = row;
  }
  openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
  }
  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }
  onSelectProject(projectId: string) {
    this.projectId = projectId;
  }
}
