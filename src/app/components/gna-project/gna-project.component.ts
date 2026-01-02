import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Project } from '../../models/project.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-gna-project',
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './gna-project.component.html',
  styleUrl: './gna-project.component.scss'
})
export class GnaProjectComponent {
  isLoading = false;
  mainTabs = [{ id: 0, label: 'Persons', routerLink: ['./', 'persons'] }, { id: 1, label: 'Relationships', routerLink: ['./', 'relationships'] }]
  mainTabId = 0;
  parentPath: any[] = [];
  // --------------------------------
  // [var] Projects
  projectId: string = '';
  project?: Project;
  projects: Project[] = [];
  // [var] Projects
  // --------------------------------
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {
    this.dataService.projects$.subscribe(projects => {
      this.rereadProject();
    });
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.rereadProject();
    });
  }
  isActive(relativePath: string): boolean {
    const absolutePath = this.router.createUrlTree([relativePath], {
      relativeTo: this.activatedRoute
    }).toString();

    return this.router.url === absolutePath;
  }
  rereadProject() {
      this.project = this.dataService.getProject(this.projectId);
  }
  onClickMainTab(tabId: number) {
    this.mainTabId = tabId;
  }
}
