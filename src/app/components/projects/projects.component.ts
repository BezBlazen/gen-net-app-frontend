import { Component, inject, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
// import { ProjectComponent } from "../project/project.component";
import { DataService } from '../../services/data.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Project } from '../../models/project.model';
// import { MatSort } from '@angular/material/sort';
// import { MatPaginator } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { ProjectPresentationEditComponent } from "../project-presentation/project-presentation-edit/project-presentation-edit.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, MatDividerModule, ProjectPresentationEditComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  project: Project | undefined;
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['id', 'title'];
  constructor(private dataService: DataService) {
    this.dataService.rereadProjectsProjectList();
    this.dataService.projectsProjectList$.subscribe((projects) =>  {
      if (projects?.isLoading != true) {
        this.dataSource.data = projects?.data == undefined ? new Array<Project>() : projects?.data;
        if (projects?.data == undefined || projects.data.findIndex(e => e.id === this.project?.id) < 0) {
          this.project = projects?.data == undefined ? undefined : projects.data[0]
        }      
      }
    });
    // this.dataService.getProjects().subscribe(projects => {
    //   if (projects?.data != undefined) {
    //     this.dataSource.data = projects?.data;
    //   } 
    //   // Reset project edit form
    //   if (!(projects?.data?.some(prj => prj.id == this.projectObj?.id))) {
    //     this.projectObj = undefined;
    //   }
    // });
  }
  postProject() {
    // const project = new Project(-1, 'Test');
    // this.dataService.postProject(project).subscribe((project) => {
    //   this.dataService.getProjects();
    // });
  }
  selectProject(row:Project) {
    this.project = row;
  }
  readonly dialog = inject(MatDialog);
  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(ProjectPresentationEditComponent, { disableClose: true });
    dialogRef.componentInstance.project = new Project('', '');
    dialogRef.componentInstance.dialogRef = dialogRef;
    //     const dialogRef = this.dialog.open(EntityViewDialogComponent, {
    //   data: this.project,
    // });
  }  
}
