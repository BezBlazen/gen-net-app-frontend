import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ApiDataWrapper } from '../../services/api-data-wrapper';
import { Project } from '../../models/project.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MatListModule, MatToolbarModule, MatSidenavModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {
  project: Project | undefined;
  projects: ApiDataWrapper<Project[]> | null = null;

  constructor(private dataService: DataService) {
    this.dataService.getProjects().subscribe(projects => {
      this.projects = projects;
      // this.dataService.selectProject(this.projects?.data == undefined || this.projects?.data.length < 1 ? undefined : this.projects?.data[0]);
      // console.log("length > 0:" + (this.projects?.data?.length != undefined && this.projects?.data?.ge length > 0));
      console.log(this.projects?.data == undefined ? undefined : this.projects?.data);
    });
    this.dataService.project$.subscribe(project => this.project = project);
  }
  postProject() {
    const  project : Project = { id: -1, title: 'Test'};
    this.dataService.postProject(project).subscribe((project) => {
      this.dataService.getProjects();
    });
  }
  getProjects() {
    this.dataService.getProjects();
  }  
}
