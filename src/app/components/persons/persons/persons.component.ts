import { Component, ElementRef, ViewChild } from '@angular/core';
import { ViewMode } from '../../base-view/base-view.component';
import { Person } from '../../../models/person.model';
import { PersonViewComponent } from "../person-view/person-view.component";

@Component({
  selector: 'app-persons',
  imports: [PersonViewComponent],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.scss'
})
export class PersonsComponent {
  isLoading = false;
  // --------------------------------
  // [var] Projects
  person?: Person;
  persons: Person[] = [];
  readonly ViewMode = ViewMode;
  @ViewChild('dialogPersonNew') dialogPersonNew!: ElementRef<HTMLDialogElement>;
  // [var] Projects
  // --------------------------------

  setPerson(row: Person) {
    this.person = row;
  }
  openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
  }
  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }
}
