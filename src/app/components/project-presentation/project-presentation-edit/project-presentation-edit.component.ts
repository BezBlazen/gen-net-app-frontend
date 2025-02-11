import { Component, Inject, inject, Input, Optional, SimpleChanges } from '@angular/core';
import { Project } from '../../../models/project.model';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataService } from '../../../services/data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
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
  @Input() project!: Project;
  // @Input() dialogRef: MatDialogRef<ProjectPresentationEditComponent> | undefined;
  projectForm: FormGroup;
  serviceProject: ApiDataWrapper<Project> | null = null;
  readonly dialog = inject(MatDialog);

  constructor(
      @Optional() public dialogRef: MatDialogRef<ProjectPresentationEditComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: Project,
      private dataService: DataService, 
      private formBuilder: FormBuilder) {

    this.projectForm = formBuilder.group({
      id: ['', Validators.required],
      title: ['', Validators.required]
    });

    // If component used as dialog, use received data
    if (this.dialogRef)
      this.project = this.data;
    
  }

  ngOnInit() {
    // if (this.data != undefined)
    this.projectForm.patchValue(this.project);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.projectForm.patchValue(changes['project'].currentValue);
  }

  postProject() {
    this.dataService.postProject(this.projectForm.value).subscribe( (project) => {
      this.serviceProject = project;
      if (project?.isLoading == false && project.error == null) {
        this.dataService.rereadAppProjectList();
        this.dataService.rereadProjectsProjectList();
        this.closeDialog();
      }
    });
  }
  putProject() {
    this.dataService.putProject(this.projectForm.value).subscribe( (project) => {
      this.serviceProject = project;
      if (project?.isLoading == false && project.error == null) {
        this.dataService.rereadAppProjectList();
        this.dataService.rereadProjectsProjectList();
      }
    });    
  }
  setAppProject(project: Project) {
    this.dataService.setAppProject(project);   
  }    
  deleteProject() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true });
    dialogRef.componentInstance.title = "Delete project";
    dialogRef.componentInstance.action = "remove project '"+this.project.title+"'";
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      this.dataService.deleteProject(this.project).subscribe((project) => {
        if (project?.isLoading == false && project.error == null) {
          this.dataService.rereadAppProjectList();
          this.dataService.rereadProjectsProjectList();
          dialogRef.close();
        } else {
          dialogRef.componentInstance.isLoading = project?.isLoading;
          dialogRef.componentInstance.errorMessage = project?.error;
        }
      });
    });    
  }
  closeDialog() {
    this.dialogRef?.close();
  }  
}
