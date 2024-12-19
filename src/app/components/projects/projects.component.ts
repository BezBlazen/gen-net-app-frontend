import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProjectComponent } from "../project/project.component";
import { DataService } from '../../services/data.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Project } from '../../models/project.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, ProjectComponent, MatTableModule, MatDividerModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['id', 'title'];
  constructor(private dataService: DataService) {
    this.dataService.getProjects().subscribe(projects => {
      if (projects?.data != undefined)
        this.dataSource.data = projects?.data;
    });
  }
  postProject() {
    const  project : Project = { id: -1, title: 'Test'};
    this.dataService.postProject(project).subscribe((project) => {
      this.dataService.getProjects();
    });
  }  
}
