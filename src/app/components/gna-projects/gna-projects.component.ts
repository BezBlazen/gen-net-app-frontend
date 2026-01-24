import { Component } from '@angular/core';
import { ProjectSelectorComponent } from '../projects/project-selector/project-selector.component';
import { SelectorUIConfig } from '../entity-selector/entity-selector.component';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Project } from '../../models/api.model';

@Component({
  selector: 'app-gna-projects',
  imports: [
    ProjectSelectorComponent,
  ],
  templateUrl: './gna-projects.component.html',
  styleUrl: './gna-projects.component.scss'
})
export class GnaProjectsComponent {
  // --------------------------------
  // [vars]
  projectId?: string;
  project?: Project;
  projects: Project[] = [];
  projectSelectorConfig: SelectorUIConfig = {
    toolbar: true,
    entity_view: true,
  }
  // [vars]
  // --------------------------------
  // [variables] Subscriptions
  private projectsSubscription?: Subscription;
  // [variables] Subscriptions
  // --------------------------------
  constructor(private dataService: DataService) {
  }
  ngOnInit() {
    this.projectsSubscription = this.dataService.projects$.subscribe(projects => {
      this.projects = projects;
    });
  }
  ngOnDestroy() {
    this.projectsSubscription?.unsubscribe();
  }
}
