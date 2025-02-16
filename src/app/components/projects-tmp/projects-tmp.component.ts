import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Project } from '../../models/project.model';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { ApiDataWrapper } from '../../services/api-data-wrapper';

@Component({
  selector: 'app-projects-tmp',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent, MatDividerModule, MatProgressBarModule],
  templateUrl: './projects-tmp.component.html',
  styleUrl: './projects-tmp.component.scss'
})
export class ProjectsTmpComponent {
  tmpProjects: ApiDataWrapper<Project[]> | null = null;
  onAction: boolean = false;
  constructor(public dialogRef: MatDialogRef<ProjectsTmpComponent>, @Inject(MAT_DIALOG_DATA) public data: Project[], private dataService: DataService) {
    this.dataService.appTmpProjectList$.subscribe(projects => {
      this.tmpProjects = projects;
      if (this.onAction && projects?.isLoading != true && projects?.error == undefined) {
        this.dialogRef.close();
        this.dataService.rereadProjectsProjectList();
      }
    });
  }
  onSave() {
    this.dataService.moveTmpProjectList();
    this.onAction = true;
  }
  onDelete() {
    this.dataService.deleteTmpProjectList();
    this.onAction = true;
  }   
}
