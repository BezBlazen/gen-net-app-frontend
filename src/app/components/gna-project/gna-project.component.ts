import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Project } from '../../models/project.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-gna-project',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './gna-project.component.html',
  styleUrl: './gna-project.component.scss'
})
export class GnaProjectComponent {
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
