import { Component, effect, inject, Signal } from '@angular/core';
import { PersonSelectorComponent } from '../persons/person-selector/person-selector.component';
import { PersonViewComponent } from '../persons/person-view/person-view.component';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { SelectorUIConfig } from '../entity-selector/entity-selector.component';
import { Project } from '../../models/project.model';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-gna-project-persons',
  imports: [
    PersonSelectorComponent,
  ],
  templateUrl: './gna-project-persons.component.html',
  styleUrl: './gna-project-persons.component.scss'
})
export class GnaProjectPersonsComponent {
  // routerData = inject(ROUTER_OUTLET_DATA) as Signal<string | undefined>;
  // --------------------------------
  // [var] Projects
  projectId?: string;
  persons: Person[] = [];
  // [var] Projects
  // --------------------------------
  // [variables] Subscriptions
  private activeProjectIdSubscription?: Subscription;
  private personsSubscription?: Subscription;
  // [variables] Subscriptions
  personId?: string;
  personSelectorConfig: SelectorUIConfig = {
    toolbar: true,
    entity_view: true,
  }
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dataService: DataService) {
  }
  ngOnInit() {
    this.activeProjectIdSubscription = this.dataService.activeProjectId$.subscribe(projectId => {
      this.projectId = projectId;
      this.dataService.getActiveProjectPersons();
    });
    this.personsSubscription = this.dataService.persons$.subscribe(persons => {
      this.persons = persons.filter(person => person.projectId == this.projectId);
    });
  }
  ngOnDestroy() {
    this.activeProjectIdSubscription?.unsubscribe();
    this.personsSubscription?.unsubscribe();
  }
  onSelectItem(personId: string | undefined) {
    this.personId = personId;
  }
}
