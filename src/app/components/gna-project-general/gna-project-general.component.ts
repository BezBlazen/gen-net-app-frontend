import { Component, effect, inject, Signal } from '@angular/core';
import { ProjectViewComponent } from '../projects/project-view/project-view.component';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';

@Component({
  selector: 'app-gna-project-general',
  imports: [ProjectViewComponent],
  templateUrl: './gna-project-general.component.html',
  styleUrl: './gna-project-general.component.scss'
})
export class GnaProjectGeneralComponent {
  routerData = inject(ROUTER_OUTLET_DATA) as Signal<string | undefined>;
  projectId?: string;
  constructor(private router: Router) {
    effect(() => {
      this.projectId = this.routerData();
    });
  }
  onDeleted() {
    this.router.navigate(['/', 'gna', 'projects']);
  }
}
