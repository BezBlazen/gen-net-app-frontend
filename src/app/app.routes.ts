import { Routes } from '@angular/router';
import { MainSiteComponent } from './components/main-site/main-site.component';
import { MainAppComponent } from './components/main-app/main-app.component';

export const routes: Routes = [
    {
        path: '',
        component: MainSiteComponent,
    },
    {
        path: 'app',
        component: MainAppComponent
    },
];
