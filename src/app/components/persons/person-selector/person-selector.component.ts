import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Person } from '../../../models/person.model';
import { EntitySelectorComponent, SelectorUIConfig } from '../../entity-selector/entity-selector.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PersonViewComponent } from '../person-view/person-view.component';
import { PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';

@Component({
  selector: 'app-person-selector',
  imports: [
    EntitySelectorComponent,
    PersonViewComponent
  ],
  templateUrl: './person-selector.component.html',
  styleUrl: './person-selector.component.scss'
})
export class PersonSelectorComponent extends EntitySelectorComponent {
  // --------------------------------
  // [variables]
  isLoading = false;
  persons: Person[] = [];
  _personId = new BehaviorSubject<string | undefined>(undefined);
  @Output() personId = this._personId.asObservable();
  @Input() projectId?: string;
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
    if (this.projectId) {
      this.reloadPersons(this.projectId);
    }
  }
  // [events]
  // --------------------------------
  constructor(
    private dataService: DataService
  ) {
    super();
    this.dataService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.dataService.persons$.subscribe(persons => {
      if (this.projectId) {
        this.rereadPersons(this.projectId);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId']) {
      this.projectId = changes['projectId'].currentValue;
      if (this.projectId) {
        this.rereadPersons(this.projectId);
        if (this.persons.length == 0) {
          this.reloadPersons(this.projectId)
        }
      }
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
  rereadPersons(projectId: string) {
    this.persons = this.dataService.getPersonsLocal(projectId);
    if (this.persons != null && this.persons.length > 0) {
      const p = this.persons.find(person => person.id === this._personId.getValue());
      if (p) {
        this.setSelectedPerson(p.id);
      } else {
        this.setSelectedPerson(this.persons[0].id);
      }
    } else {
      this.setSelectedPerson(undefined);
    }
  }
  reloadPersons(projectId: string) {
    this.dataService.getPersons(projectId).subscribe((success) => {
    });
  }
  getConfig(): SelectorUIConfig {
    const config: SelectorUIConfig = {
      title: 'Select Person',
    };
    return config;
  }
  setSelectedPerson(personId: string | undefined) {
    this._personId.next(personId);
  }
  isActive(id: string | undefined) {
    return id && this._personId.getValue() === id;
  }
  onInit() {
    if (this.projectId) {
      this.rereadPersons(this.projectId);
      if (this.persons.length == 0) {
        this.reloadPersons(this.projectId);
      }
    }
  }
}