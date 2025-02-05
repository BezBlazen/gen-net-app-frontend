import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Project } from '../../../models/project.model';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataService } from '../../../services/data.service';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { ApiDataWrapper } from '../../../services/api-data-wrapper';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-project-presentation-edit',
  standalone: true,
  imports: [MatProgressBarModule, MatDialogTitle, MatDividerModule, MatToolbarModule, MatIconModule, MatButtonModule, MatDialogActions, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, ReactiveFormsModule],
  templateUrl: './project-presentation-edit.component.html',
  styleUrl: './project-presentation-edit.component.scss'
})
export class ProjectPresentationEditComponent {
  @Input() projectObj!: Project;
  @Input() dialogRef: MatDialogRef<ProjectPresentationEditComponent> | undefined;
  projectForm: FormGroup;
  serviceProject: ApiDataWrapper<Project> | null = null;
  readonly dialog = inject(MatDialog);

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.projectForm = formBuilder.group({
      id: ['', Validators.required],
      title: ['', Validators.required]
    });
    
  }

  ngOnInit() {
    this.projectForm.patchValue(this.projectObj);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.projectForm.patchValue(changes['projectObj'].currentValue);
  }

  postProject() {
    this.dataService.postProject(this.projectForm.value).subscribe( (project) => {
      this.serviceProject = project;
      if (project?.isLoading == false && project.error == null) {
        this.dataService.getProjects();
        this.closeDialog();
      }
    });
  }
  putProject() {
    this.dataService.putProject(this.projectForm.value).subscribe( (project) => {
      this.serviceProject = project;
      if (project?.isLoading == false && project.error == null) {
        this.dataService.getProjects();
      }
    });    
  }  
  deleteProject() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true });
    dialogRef.componentInstance.title = "Delete project";
    dialogRef.componentInstance.action = "remove project '"+this.projectObj.title+"'";
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      this.dataService.deleteProject(this.projectObj).subscribe((project) => {
        if (project?.isLoading == false && project.error == null) {
          dialogRef.close();
          this.dataService.getProjects();
        } else {
          dialogRef.componentInstance.isLoading = project?.isLoading;
          dialogRef.componentInstance.errorMessage = project?.error;
        }
      });
    });    
    // this.dataService.deleteProject(this.projectForm.value).subscribe((project) => {
    //   this.serviceProject = project;
    //   if (project?.isLoading == false && project.error == null) {
    //     this.dataService.getProjects();
    //     this.closeDialog();
    //   }
    // });
  }
  closeDialog() {
    this.dialogRef?.close();
  }  
}
