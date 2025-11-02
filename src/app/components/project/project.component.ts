import { Component, Input } from '@angular/core';
import { Project } from '../../models/project.model';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-project',
  imports: [    
    FormsModule,
    FormlyModule,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  @Input() project?: Project;
  form = new FormGroup({});
  model = this.project;
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'id',
      type: 'input',
      props: {
        label: 'Id',
        disabled: true
      }
    },
    {
      key: 'title',
      type: 'input',
      props: {
        label: 'Title',
        required: true,
        errorTitle: '6-64 chars',
      }
    },
    {
      key: 'createdAt',
      type: 'input',
      props: {
        label: 'Created at',
        disabled: true
      }
    },
  ];
}
