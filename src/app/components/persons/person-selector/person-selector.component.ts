import { Component, ElementRef, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Gender, Person } from '../../../models/person.model';
import { EntitySelectorComponent, SelectorUIConfig } from '../../entity-selector/entity-selector.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PersonViewComponent } from '../person-view/person-view.component';
import { PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { PersonUtilsComponent } from '../person-utils/person-utils.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-person-selector',
  imports: [
    EntitySelectorComponent,
    PersonViewComponent,
    RouterModule
  ],
  templateUrl: './person-selector.component.html',
  styleUrl: './person-selector.component.scss'
})
export class PersonSelectorComponent extends EntitySelectorComponent {
  // --------------------------------
  // [variables]
  @Input() projectId?: string;
  persons: Person[] = [];
  personId?: string;
  isLoading = false;
  @ViewChild('dialogPersonNew') dialogPersonNew!: ElementRef<HTMLDialogElement>;
  // [variables]
  // --------------------------------
  // [variables] Subscriptions
  private personsSubscription?: Subscription;
  // [variables] Subscriptions
  // --------------------------------
  // [events]
  onAdd(): void {
    this.openDialog(this.dialogPersonNew.nativeElement);
  }
  onRefresh(): void {
    this.reloadPersons();
  }
  // [events]
  // --------------------------------
  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId']) {
      this.reloadPersons();
    }
  }
  getNewPersonDialodConfig(): PresentationUIConfig {
    const config: PresentationUIConfig = {
      mode: PresentationViewMode.CREATE,
      title: 'Create Person',
      toolbar: false
    };
    return config;
  }
  rereadPersons() {
    this.persons = this.dataService.getPersonsLocal(this.projectId) ?? [];
    if (!this.persons || this.persons.length == 0) {
      this.reloadPersons();
    } else {
      this.updateActiveItem();
    }
  }
  reloadPersons() {
    if (!this.projectId) {
      throw new Error('projectId is required');
    }
    this.dataService.getPersons(this.projectId).subscribe((success) => {
      if (success) {
        this.persons = this.dataService.getPersonsLocal(this.projectId) ?? [];
      }
      this.updateActiveItem();
    });
  }
  updateActiveItem() {
    const p = this.persons ? this.persons.find(person => person.id === this.personId) : undefined;
    if (!p) {
      this.personId = (this.persons ?? []).length > 0 ? this.persons[0].id : undefined;
    }
  }
  /*
rereadProjects() {
  this.projects = this.dataService.getProjectsLocal() ?? [];
  if (!this.projects || this.projects.length == 0) {
    this.reloadProjects();
  } else {
    this.updateActiveItem();
  }
}
reloadProjects() {
  this.dataService.getProjects().subscribe((success) => {
    if (success) {
      this.projects = this.dataService.getProjectsLocal() ?? [];
    }
    this.updateActiveItem();
  });
}
updateActiveItem() {
  const p = this.projects ? this.projects.find(project => project.id === this.projectId)?.id : undefined;
  if (!p) {
    this.projectId = (this.projects ?? []).length > 0 ? this.projects[0].id : undefined;
  }
}
*/
  getConfig(): SelectorUIConfig {
    const config: SelectorUIConfig = {
      title: 'Select Person',
    };
    return config;
  }
  getGender(person: Person): string | undefined {
    return Object.values(Gender).find(gender => gender.value === person.gender?.type)?.label;
  }
  setSelectedPerson(personId: string | undefined) {
    this.personId = personId;
  }
  onInit() {
    this.reloadPersons();
  }
  getPreferredFirstName(person: Person | undefined) {
    return PersonUtilsComponent.getPreferredFirstName(person);
  }
  getPreferredLastName(person: Person | undefined) {
    return PersonUtilsComponent.getPreferredLastName(person);
  }
  onDeleteEmitted() {
    this.rereadPersons();
  }
  onSaveEmitted() {
    this.rereadPersons();
  }
  onAddEmitted() {
    this.rereadPersons();
  }
}