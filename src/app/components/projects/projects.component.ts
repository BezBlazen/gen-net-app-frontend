import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Project } from '../../models/project.model';
import { ProjectComponent } from "../project/project.component";

@Component({
  selector: 'app-projects',
  imports: [ProjectComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  // --------------------------------
  // [var] Projects
  project?: Project;
  projects: Project[] = [];
  // [var] Projects
  // --------------------------------
  constructor(
    private dataService: DataService
  ) {
    this.dataService.projects$.subscribe(projects => {
      this.projects = projects;
      if (this.project == null && projects != null && projects.length > 0) {
        this.project = projects[0];
      }
    });
  }
  setProject(row: Project) {
    this.project = { ...row };
  }
}
