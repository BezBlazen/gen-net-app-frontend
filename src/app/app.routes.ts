import { Routes } from '@angular/router';
import { GnaComponent } from './components/gna/gna.component';
import { GnaProjectsComponent } from './components/gna-projects/gna-projects.component';
import { GnaProjectComponent } from './components/gna-project/gna-project.component';
import { GnaProjectGeneralComponent } from './components/gna-project-general/gna-project-general.component';
import { GnaProjectPersonsComponent } from './components/gna-project-persons/gna-project-persons.component';
import { GnaProjectRelationshipsComponent } from './components/gna-project-relationships/gna-project-relationships.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/gna',
        pathMatch: 'full'
    },
    {
        path: 'gna',
        component: GnaComponent,
        children: [
            {
                path: 'projects',
                component: GnaProjectsComponent,
            },
            {
                path: 'projects/:id',
                component: GnaProjectComponent,
                children: [
                    {
                        path: '',
                        component: GnaProjectGeneralComponent,
                    },
                    {
                        path: 'persons',
                        component: GnaProjectPersonsComponent,
                    },
                    {
                        path: 'relationships',
                        component: GnaProjectRelationshipsComponent,
                    }
                ]
            }
        ]
    },
];
