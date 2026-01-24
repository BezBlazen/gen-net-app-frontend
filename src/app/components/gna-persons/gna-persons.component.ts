import { Component } from '@angular/core';
import { PersonSelectorComponent } from '../persons/person-selector/person-selector.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectorUIConfig } from '../entity-selector/entity-selector.component';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { Person } from '../../models/api.model';
// import { Person } from '../../models/person.model';

@Component({
  selector: 'app-gna-persons',
  imports: [
    PersonSelectorComponent,
  ],
  templateUrl: './gna-persons.component.html',
  styleUrl: './gna-persons.component.scss'
})
export class GnaPersonsComponent {
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
