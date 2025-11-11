import { Component, effect, inject, Signal } from '@angular/core';
import { ProjectViewComponent } from '../project-view/project-view.component';
import { ViewMode } from '../base-view/base-view.component';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-general',
  imports: [
    ProjectViewComponent,
  ],
  templateUrl: './project-general.component.html',
  styleUrl: './project-general.component.scss'
})
export class ProjectGeneralComponent {
  routerData = inject(ROUTER_OUTLET_DATA) as Signal<Project | undefined>;
  readonly ViewMode = ViewMode;
  project?: Project;
  constructor(private router: Router) {
    effect(() => {
      this.project = this.routerData();
      // if (project) {
      //   this.model = { ...project }
      //   console.log("model", this.model)
      // }
    });
  }
  onDeleted() {
    this.router.navigate(['/', 'app', 'projects']);
  }
}
