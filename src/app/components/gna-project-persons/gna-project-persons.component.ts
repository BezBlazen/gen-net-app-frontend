import { Component, effect, inject, Signal } from '@angular/core';
import { PersonSelectorComponent } from '../persons/person-selector/person-selector.component';
import { PersonViewComponent } from '../persons/person-view/person-view.component';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { SelectorUIConfig } from '../entity-selector/entity-selector.component';

@Component({
  selector: 'app-gna-project-persons',
  imports: [
    PersonSelectorComponent,
  ],
  templateUrl: './gna-project-persons.component.html',
  styleUrl: './gna-project-persons.component.scss'
})
export class GnaProjectPersonsComponent {
  routerData = inject(ROUTER_OUTLET_DATA) as Signal<string | undefined>;
  projectId?: string;
  personId?: string;
  personSelectorConfig: SelectorUIConfig = {
    toolbar: true,
    entity_view: true,
  }
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    effect(() => {
      this.projectId = this.routerData();
    });
  }
  ngOnInit() {
    // Initial fetch
    this.projectId = this.activatedRoute.snapshot.paramMap.get('projectId') ?? undefined;
    // this.personId = this.activatedRoute.snapshot.paramMap.get('personId') ?? undefined;

    // If the component can be reused
    this.activatedRoute.paramMap.subscribe(params => {
      this.projectId = params.get('projectId') ?? undefined;
    //   this.personId = params.get('personId') ?? undefined;
    });
  }
  onSelectItem(personId: string | undefined) {
    this.personId = personId;
    console.log('onSelectItem', personId)
  }
}
