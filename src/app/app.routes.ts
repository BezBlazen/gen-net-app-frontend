import { Routes } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects.component';
import { PersonsComponent } from './components/persons/persons.component';
import { ContainerComponent } from './components/container/container.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { authGuard, unAuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {   path: '',
        canActivate: [unAuthGuard],
        component: WelcomeComponent},
    // {   path: 'welcome', component: WelcomeComponent},
    {   path: 'app', 
        component: ContainerComponent, 
        canActivate: [authGuard], 
        children: [
            {path: 'projects', component: ProjectsComponent},
            {path: 'persons', component: PersonsComponent},]
        },
];
