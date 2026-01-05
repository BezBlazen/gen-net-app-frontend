import { Routes } from '@angular/router';
import { GnaComponent } from './components/gna/gna.component';
import { GnaProjectsComponent } from './components/gna-projects/gna-projects.component';
import { GnaProjectPersonsComponent } from './components/gna-project-persons/gna-project-persons.component';
import { GnaProjectRelationshipsComponent } from './components/gna-project-relationships/gna-project-relationships.component';
import { GnaGeneralComponent } from './components/gna-general/gna-general.component';

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
                path: '',
                component: GnaGeneralComponent,
            },
            {
                path: 'projects',
                component: GnaProjectsComponent,
            },
            {
                path: 'persons',
                component: GnaProjectPersonsComponent,
            },
            {
                path: 'relationships',
                component: GnaProjectRelationshipsComponent,
            },
            // {
            //     path: 'projects/:projectId',
            //     component: GnaProjectComponent,
            //     children: [
            //         {
            //             path: '',
            //             // component: GnaProjectGeneralComponent,
            //             redirectTo: 'persons',
            //             pathMatch: 'full'
            //         },
            //         {
            //             path: 'persons',
            //             component: GnaProjectPersonsComponent,
            //         },
            //         {
            //             path: 'relationships',
            //             component: GnaProjectRelationshipsComponent,
            //         }
            //     ]
            // }
        ]
    },
];
