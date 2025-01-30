import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Project } from '../../../models/project.model';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataService } from '../../../services/data.service';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project-presentation-edit',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatDialogActions, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, ReactiveFormsModule],
  templateUrl: './project-presentation-edit.component.html',
  styleUrl: './project-presentation-edit.component.scss'
})
export class ProjectPresentationEditComponent {
  @Input() projectObj!: Project;
  @Input() dialogRef: MatDialogRef<ProjectPresentationEditComponent> | undefined;
  projectForm: FormGroup;

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
    console.log(this.projectForm.value);
    // const project = new Project(-1, 'Test');
    this.dataService.postProject(this.projectForm.value).subscribe((project) => {
      this.dataService.getProjects();
    });
  }
  closeDialog() {
    this.dialogRef?.close();
  }  
}
