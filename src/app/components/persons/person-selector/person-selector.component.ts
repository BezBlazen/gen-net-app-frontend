import { Component, ElementRef, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Gender } from '../../../models/person.model';
import { EntitySelectorComponent, SelectorUIConfig } from '../../entity-selector/entity-selector.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PersonViewComponent } from '../person-view/person-view.component';
import { PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { PersonUtilsComponent } from '../person-utils/person-utils.component';
import { Router, RouterModule } from '@angular/router';
import { Person } from '../../../models/api.model';

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
  @Input() persons: Person[] = [];
  personId?: string;
  @ViewChild('dialogPersonNew') dialogPersonNew!: ElementRef<HTMLDialogElement>;
  // [variables]
  // --------------------------------
  // [events]
  onAdd(): void {
    this.openDialog(this.dialogPersonNew.nativeElement);
  }
  onRefresh(): void {
    // this.dataService.getPersons(this.projectId);
  }
  // [events]
  // --------------------------------
  constructor(
    private dataService: DataService
  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['persons']) {
      this.updateActiveItem();
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
  updateActiveItem() {
    const p = this.persons ? this.persons.find(person => person.id === this.personId) : undefined;
    if (!p) {
      this.personId = (this.persons ?? []).length > 0 ? this.persons[0].id : undefined;
    }
  }
  getConfig(): SelectorUIConfig {
    const config: SelectorUIConfig = {
      title: 'Select Person',
    };
    return config;
  }
  getGender(person: Person): string | undefined {
    return this.dataService.dictUri?.find(gender => gender.uri === person.gender?.type)?.title;
  }
  setSelectedPerson(personId: string | undefined) {
    this.personId = personId;
  }
  onInit() {
    // this.reloadPersons();
  }
  getPreferredFullName(person: Person | undefined) {
    return PersonUtilsComponent.getPreferredFullName(person);
  }
  getPreferredFirstName(person: Person | undefined) {
    return PersonUtilsComponent.getPreferredFirstName(person);
  }
  getPreferredLastName(person: Person | undefined) {
    return PersonUtilsComponent.getPreferredLastName(person);
  }
  onDeleteEmitted() {
    // this.rereadPersons();
  }
  onSaveEmitted() {
    // this.rereadPersons();
  }
  onAddEmitted() {
    // this.rereadPersons();
  }
}