import { Component, Inject, inject, Input, Optional, SimpleChanges } from '@angular/core';
import { Project } from '../../models/project.model';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataService } from '../../services/data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { ApiDataWrapper } from '../../services/api-data-wrapper';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { DialogWarningComponent } from '../dialog-warning/dialog-warning.component';
import { PresentationDataWrapper, PresentationMode } from '../../models/presentation.model';

@Component({
  selector: 'app-project-presentation',
  standalone: true,
  imports: [MatProgressBarModule, MatDialogTitle, MatDividerModule, MatToolbarModule, MatIconModule, MatButtonModule, MatDialogActions, MatFormFieldModule, FormsModule, MatInputModule, MatDialogContent, ReactiveFormsModule],
  templateUrl: './project-presentation.component.html',
  styleUrl: './project-presentation.component.scss'
})
export class ProjectPresentationComponent {
  @Input() payload!: PresentationDataWrapper<Project>;
  data: Project = new Project();
  schema: any;
  uischema: any;
  // @Input() project!: Project;
  // @Input() mode!: PresentationMode;
  serviceProject: ApiDataWrapper<Project> | null = null;
  errorMessage: string | undefined;
  readonly dialog = inject(MatDialog);
  dialogRef: MatDialogRef<ProjectPresentationComponent> | undefined;
  form = new FormGroup({});
  isFormValid = false;
  // renderers = angularMaterialRenderers;
  form_config_create = {
    uischema : {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/title',
        },
      ],
    },
    schema : {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['title'],
    }
  };
  form_config_edit = {
    uischema : {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/id',
          options: {
            readonly: true
          }
        },
        {
          type: 'Control',
          scope: '#/properties/title',
        },
        {
          type: 'Control',
          scope: '#/properties/create_date',
          options: {
            readonly: true
          }
        },
      ],
    },
    schema : {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        title: {
          type: 'string',
          minLength: 1,
        },
        create_date: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['title'],
    }
  }  

  constructor(private dataService: DataService) {

  }
  ngOnInit() {
    this.data = this.payload.data;
    this.dialogRef = this.payload.dialogRef;
    if (this.payload.mode == PresentationMode.Create) {
      this.uischema = this.form_config_create.uischema;
      this.schema = this.form_config_create.schema;
    } else if (this.payload.mode == PresentationMode.Edit) {
      this.uischema = this.form_config_edit.uischema;
      this.schema = this.form_config_edit.schema;
    }
  //   this.jsonFormsService.$state.subscribe(state => {
  //     const errors = state?.jsonforms?.core?.errors;
  //     console.log(errors);
  // });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.data = changes['project'].currentValue;
  }

  postProject() {
    if (this.form.valid != true) {
      return;
    }
    this.dataService.postProject(this.data).subscribe( (project) => {
      this.serviceProject = project;
      this.errorMessage = undefined;
      if (project?.isLoading != true) {
        if (project?.error != undefined) {
          this.errorMessage = project?.error;
          if (this.dialogRef == undefined)
            this.dialog.open(DialogWarningComponent, {data: project.error, disableClose: true });
        } else {
          this.dataService.rereadAppProjectList();
          this.dataService.rereadProjectsProjectList();
          this.closeDialog();
        }
      }
    });
  }
  putProject() {
    if (this.form.valid != true) {
      return;
    }
    this.dataService.putProject(this.data).subscribe( (project) => {
      this.serviceProject = project;
      this.errorMessage = undefined;
      if (project?.isLoading != true) {
        if (project?.error != undefined) {
          this.errorMessage = project?.error;
          if (this.dialogRef == undefined)
            this.dialog.open(DialogWarningComponent, {data: project.error, disableClose: true });
        } else {
          this.dataService.rereadAppProjectList();
          this.dataService.rereadProjectsProjectList();
        }
      }
    });    
  }
  setAppProject(project: Project) {
    this.dataService.setAppProject(project);   
  }    
  deleteProject() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, { disableClose: true });
    dialogRef.componentInstance.title = "Delete project";
    dialogRef.componentInstance.action = "remove project '"+this.data.title+"'";
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      this.dataService.deleteProject(this.data).subscribe((project) => {
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
  
  onDataChange(data: any) {
    this.data = data;
    // const state: JsonFormsState = this.jsonFormsService.getState();
    // console.log(state.jsonforms.core?.errors);
    
    // state.jsonforms.
    // console.log(state);
    // this.isFormValid = !state?.ajv?.errors?.length;
  }
  onErrors(data: any) {
    console.log("onErrors");
    // this.data = data;
    // const state: JsonFormsState = this.jsonFormsService.getState();
    // // state.jsonforms.
    // // console.log(state);
    // this.isFormValid = !state?.ajv?.errors?.length;
  }  
}
