import { Component } from '@angular/core';
import { NameForm, NamePartType, Person } from '../../../models/person.model';
import { P } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-person-utils',
  imports: [],
  templateUrl: './person-utils.component.html',
  styleUrl: './person-utils.component.scss'
})
export class PersonUtilsComponent {
  static calculateTotal(a: number, b: number): number {
    return a + b;
  }
  static getPreferredNameForm(person: Person | undefined): NameForm | undefined {
    // Return first name form of persons first name
    if (person?.names) {
      for (const name of person.names) {
        if (!name.nameForms) 
          continue;
        for (const nameForm of name.nameForms) {
          return nameForm;
        }
      }
    }
    return undefined;
  }
  static getPreferredFullName(person: Person | undefined): string | undefined {
    const preferredNameForm = this.getPreferredNameForm(person);
    return preferredNameForm?.fullText;
  }
  static getPreferredFirstName(person: Person | undefined): string {
    const preferredNameForm = this.getPreferredNameForm(person);
    return preferredNameForm?.parts?.find((part) => part.type === NamePartType.GIVEN)?.value ?? '';
  }
  static getPreferredLastName(person: Person | undefined): string {
    const preferredNameForm = this.getPreferredNameForm(person);
    return preferredNameForm?.parts?.find((part) => part.type === NamePartType.SURNAME)?.value ?? '';
  }
  static getPreferredName(person: Person | undefined): string {

    return this.getPreferredFullName(person) ?? (this.getPreferredFirstName(person) +" " + this.getPreferredLastName(person)).trim();
  }
}
