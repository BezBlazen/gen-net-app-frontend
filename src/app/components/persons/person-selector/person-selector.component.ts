import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Person } from '../../../models/person.model';
import { EntitySelectorComponent, SelectorUIConfig } from '../../entity-selector/entity-selector.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-person-selector',
  imports: [EntitySelectorComponent],
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
  // [variables]
  // --------------------------------
  // [events]
  onAdd(): void {
  }
  onRefresh(): void {
    this.reloadPersons();
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
      this.rereadPersons();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId']) {
      if (this.projectId) {
        this.persons = this.dataService.getPersons(this.projectId);
      } else {
        this.persons = [];
      }
    }
  }
  // onRefresh() {
  //   this.dataService.doGetPersons(this.projectId);
  // }  
  // openDialog(dialog: HTMLDialogElement) {
  //   dialog.showModal();
  // }
  // closeDialog(dialog: HTMLDialogElement) {
  //   dialog.close();
  // }
  // onInput(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;
  //   this.onSelect.emit(value);
  // }
  rereadPersons() {
    this.persons = this.dataService.getPersons(this.projectId);
    if (this.persons != null && this.persons.length > 0) {
      const p = this.persons.find(person => person.id === this._personId.getValue());
      if (p) {
        this.setPerson(p);
      } else {
        this.setPerson(this.persons[0]);
      }
    } else {
        this.setPerson(undefined);
    }
  }
  reloadPersons() {
    this.dataService.doGetPersons(this.projectId);
  }
  getConfig(): SelectorUIConfig {
    const config: SelectorUIConfig = { 
      title: 'Select Person',
    };
    return config;
  }
  setPerson(person: Person | undefined) {
    this._personId.next(person?.id);
  }
  isActive(id: string | undefined) {
    return id && this._personId.getValue() === id;
  }
  onInit() {
    this.rereadPersons();
    if (!this.projectId) {
      this.reloadPersons();
    }
  }
}