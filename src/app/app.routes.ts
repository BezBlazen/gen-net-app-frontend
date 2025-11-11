import { Routes } from '@angular/router';
import { MainSiteComponent } from './components/main-site/main-site.component';
import { MainAppComponent } from './components/main-app/main-app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectViewComponent } from './components/project-view/project-view.component';
import { ProjectItemsComponent } from './components/project-items/project-items.component';
import { PersonsComponent } from './components/persons/persons.component';
import { RelationshipsComponent } from './components/relationships/relationships.component';
import { ProjectGeneralComponent } from './components/project-general/project-general.component';

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
                component: ProjectItemsComponent,
                children: [
                    {
                        path: '',
                        component: ProjectGeneralComponent,
                    },
                    {
                        path: 'persons',
                        component: PersonsComponent,
                    },
                    {
                        path: 'relationships',
                        component: RelationshipsComponent,
                    }
                ]
            }
        ]
    },
];
