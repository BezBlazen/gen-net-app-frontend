import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { EntitySelectorComponent, SelectorUIConfig } from '../../entity-selector/entity-selector.component';
import { PersonNamesViewComponent } from '../person-names-view/person-names-view.component';
import { DataService } from '../../../services/data.service';
import { PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { DaoName, Name, NamePartType, NameType, NameTypeOptions } from '../../../models/person.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-person-names-selector',
  imports: [
    EntitySelectorComponent,
    PersonNamesViewComponent,
  ],
  templateUrl: './person-names-selector.component.html',
  styleUrl: './person-names-selector.component.scss'
})
export class PersonNamesSelectorComponent extends EntitySelectorComponent {
  // --------------------------------
  // [variables]
  @Input() personNames!: Name[];
  @ViewChild('dialogPersonName') dialogPersonName!: ElementRef<HTMLDialogElement>;
  viewMode: PresentationViewMode = PresentationViewMode.VIEW;
  _selectedItemIndex: number = -1;
  personNameViewConfig: PresentationUIConfig = {};
  personNameViewDaoName: DaoName = { name: {} };
  // [variables]
  // --------------------------------
  // [events]
  onAdd(): void {
    this.personNameViewConfig.mode = PresentationViewMode.CREATE,
      this.personNameViewConfig.title = 'Create Name';
    this.personNameViewDaoName = { name: {} };
    this.openDialog(this.dialogPersonName.nativeElement);
  }
  onEdit(): void {
    if (this._selectedItemIndex < 0) {
      console.log('No items selected');
      return;
    }
    this.personNameViewConfig.mode = PresentationViewMode.EDIT;
    this.personNameViewConfig.title = 'Edit Name';
    this.personNameViewDaoName = {
      index: this._selectedItemIndex,
      name: this.personNames[this._selectedItemIndex]
    };
    this.openDialog(this.dialogPersonName.nativeElement);
  }
  onDelete(): void {
    this.personNames.splice(this._selectedItemIndex, 1);
  }
  onAddEvent(daoName: DaoName): void {
    if (daoName.index == undefined) {
      this.personNames.push(daoName.name);
      this._selectedItemIndex = this.personNames.length - 1;
    } else if (daoName.index === 0) {
      this.personNames.unshift(daoName.name);
      this._selectedItemIndex = 0;
    } else {
      throw new Error("Unexpected action");
    }
  }
  onSaveEvent(daoName: DaoName): void {
    if (daoName.index != this._selectedItemIndex) {
      if (daoName.index != 0) {
        throw new Error("Unexpected action");
      }
      this.personNames.splice(this._selectedItemIndex, 1);
      this.personNames.unshift(daoName.name);
    } else {
      this.personNames[daoName.index] = daoName.name;
    }
  }
  // [events]
  // --------------------------------
  constructor(
    private dataService: DataService
  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personNames']) {
      this._selectedItemIndex = this.personNames.length > 0 ? 0 : -1;
    }
  }
  getPersonNameDialodConfig(): PresentationUIConfig {
    const config: PresentationUIConfig = {
      mode: this.viewMode,
      title: this.viewMode === PresentationViewMode.CREATE ? 'Create Name' : 'Edit Name',
      toolbar: false
    };
    return config;
  }
  getConfig(): SelectorUIConfig {
    const config: SelectorUIConfig = {
      title: 'Select Name',
    };
    return config;
  }
  getFullName(name: Name): string | undefined {
    return name && name.nameForms && name.nameForms[0] ? name.nameForms[0].fullText : undefined;
  }
  getFirstName(name: Name): string {
    // Return first name form if exists with NamePart type 'GIVEN'
    if (name && name.nameForms && name.nameForms[0] && name.nameForms[0].parts && name.nameForms[0].parts.length > 0) {
      for (const part of name.nameForms[0].parts) {
        if (part.type === NamePartType.GIVEN) {
          return part.value ?? '';
        }
      }
    }
    return '';
  }
  getLastName(name: Name): string {
    // Return first name form if exists with NamePart type 'SURNAME'
    if (name && name.nameForms && name.nameForms[0] && name.nameForms[0].parts && name.nameForms[0].parts.length > 0) {
      for (const part of name.nameForms[0].parts) {
        if (part.type === NamePartType.SURNAME) {
          return part.value ?? '';
        }
      }
    }
    return '';
  }
  getNameType(name: Name): string {
    return NameTypeOptions.find(option => option.value === name.type)?.label ?? '';
  }
  isActive(index: number) {
    return this._selectedItemIndex == index;
  }
  setSelectedItem(index: number) {
    this._selectedItemIndex = index;
  }
  getPersonName(): DaoName | undefined {
    if (this._selectedItemIndex >= 0) {
      return { index: this._selectedItemIndex, name: this.personNames[this._selectedItemIndex] }
    }
    return undefined
  }
}
