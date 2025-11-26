import { Component, effect, inject, Signal } from '@angular/core';
import { ProjectViewComponent } from '../projects/project-view/project-view.component';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { ViewMode } from '../base-view/base-view.component';

@Component({
  selector: 'app-gna-project-general',
  imports: [ProjectViewComponent],
  templateUrl: './gna-project-general.component.html',
  styleUrl: './gna-project-general.component.scss'
})
export class GnaProjectGeneralComponent {
  routerData = inject(ROUTER_OUTLET_DATA) as Signal<string | undefined>;
  readonly ViewMode = ViewMode;
  projectId?: string;
  constructor(private router: Router) {
    effect(() => {
      this.projectId = this.routerData();
    });
  }
  onDeleted() {
    this.router.navigate(['/', 'app', 'projects']);
  }
}
