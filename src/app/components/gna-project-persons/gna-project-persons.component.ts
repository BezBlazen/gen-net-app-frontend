import { Component, effect, inject, Signal } from '@angular/core';
import { PersonSelectorComponent } from '../persons/person-selector/person-selector.component';
import { PersonViewComponent } from '../persons/person-view/person-view.component';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';

@Component({
  selector: 'app-gna-project-persons',
  imports: [
    PersonSelectorComponent,
    PersonViewComponent
  ],
  templateUrl: './gna-project-persons.component.html',
  styleUrl: './gna-project-persons.component.scss'
})
export class GnaProjectPersonsComponent {
  routerData = inject(ROUTER_OUTLET_DATA) as Signal<string | undefined>;
  projectId?: string;
  personId?: string;
  constructor(private router: Router) {
    effect(() => {
      this.projectId = this.routerData();
    });
  }

  onSelectPerson(personId: string | undefined) {
    this.personId = personId;
  }
}
