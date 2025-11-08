import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Project } from '../../models/project.model';
import { ProjectComponent, FormViewMode } from "../project/project.component";
import { FormlyAttributes } from "@ngx-formly/core";
import { ViewMode } from '../base-view/base-view.component';

@Component({
  selector: 'app-projects',
  imports: [ProjectComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  isLoading = false;
  // --------------------------------
  // [var] Projects
  project?: Project;
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
          const p = projects.find(project => project.id === this.project?.id);
          if (p) {
            this.project = p;
          } else {
            this.project = projects[0];
          }
        } else {
          this.project = undefined;
        }
      }
    });
  }
  setProject(row: Project) {
    this.project = row;
  }
  openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
  }
  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }
}
