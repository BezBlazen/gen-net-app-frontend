import { Routes } from '@angular/router';
import { MainSiteComponent } from './components/main-site/main-site.component';
import { MainAppComponent } from './components/main-app/main-app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectComponent } from './components/project/project.component';

export const routes: Routes = [
    {
        path: '',
        component: MainSiteComponent,
    },
    {
        path: 'app',
        component: MainAppComponent,
        children: [
            {
                path: 'projects',
                component: ProjectsComponent,
            },
            {
                path: 'projects/:id',
                component: ProjectComponent,
            }
        ]
    },
];
