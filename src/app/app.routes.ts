import { Routes } from '@angular/router';
import { GnaComponent } from './components/gna/gna.component';
import { GnaGeneralComponent } from './components/gna-general/gna-general.component';
import { GnaPersonsComponent } from './components/gna-persons/gna-persons.component';
import { GnaProjectsComponent } from './components/gna-projects/gna-projects.component';
import { GnaRelationshipsComponent } from './components/gna-relationships/gna-relationships.component';
import { GnaTreeComponent } from './components/gna-tree/gna-tree.component';

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
                path: 'tree',
                component: GnaTreeComponent,
            },
            {
                path: 'projects',
                component: GnaProjectsComponent,
            },
            {
                path: 'persons',
                component: GnaPersonsComponent,
            },
            {
                path: 'relationships',
                component: GnaRelationshipsComponent,
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
