import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Project } from '../../models/project.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-project-items',
  imports: [
    RouterLink,

    RouterOutlet
  ],
  templateUrl: './project-items.component.html',
  styleUrl: './project-items.component.scss'
})
export class ProjectItemsComponent {
  isLoading = false;
  // urlPath: any[] = [];
  parentPath: any[] = [];
  // childPath: any[] = [];
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
      this.project = this.dataService.getProject(this.projectId);
    });
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      this.project = this.dataService.getProject(this.projectId);
    });
  }
  isActive(relativePath: string): boolean {
    const absolutePath = this.router.createUrlTree([relativePath], {
      relativeTo: this.activatedRoute
    }).toString();

    return this.router.url === absolutePath;
  }
}
