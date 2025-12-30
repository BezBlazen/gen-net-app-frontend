import { Component, ElementRef, ViewChild } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectViewComponent } from '../projects/project-view/project-view.component';
import { ProjectSelectorComponent } from '../projects/project-selector/project-selector.component';
import { Router } from '@angular/router';
import { SelectorUIConfig } from '../entity-selector/entity-selector.component';

@Component({
  selector: 'app-gna-projects',
  imports: [
    ProjectSelectorComponent,
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
  projectSelectorConfig: SelectorUIConfig = {
    toolbar: true,
    entity_view: true,
  }
  // [vars]
  // --------------------------------
  constructor(private router: Router) {
  }
}
