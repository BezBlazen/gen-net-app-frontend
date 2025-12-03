import { Component, ElementRef, ViewChild } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectViewComponent } from '../projects/project-view/project-view.component';
import { ProjectSelectorComponent } from '../projects/project-selector/project-selector.component';
import { Router } from '@angular/router';

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
  // --------------------------------
  // [vars]
  projectId?: string;
  project?: Project;
  projects: Project[] = [];
  @ViewChild('dialogProjectNew') dialogProjectNew!: ElementRef<HTMLDialogElement>;
  // [vars]
  // --------------------------------
  constructor(private router: Router) {
  }
  openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
  }
  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }
  onSelectProject(projectId: string | undefined) {
    this.projectId = projectId;
  }
  onDeleted() {
    this.router.navigate(['/', 'gna', 'projects']);
  }
}
