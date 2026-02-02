import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { EntitySelectorComponent, SelectorUIConfig } from '../../entity-selector/entity-selector.component';
import { PersonFactViewComponent } from '../person-fact-view/person-fact-view.component';
import { FactApi } from '../../../../api/model/fact';
import { PresentationUIConfig, PresentationViewMode } from '../../entity-presentation/entity-presentation.component';
import { DataService } from '../../../services/data.service';
import { FactLocal } from '../../../models/person.model';

@Component({
  selector: 'app-person-fact-selector',
  imports: [
    EntitySelectorComponent,
    PersonFactViewComponent,
  ],
  templateUrl: './person-fact-selector.component.html',
  styleUrl: './person-fact-selector.component.scss'
})
export class PersonFactSelectorComponent extends EntitySelectorComponent {
  // --------------------------------
  // [variables]
  @Input() facts!: FactApi[];
  @ViewChild('dialogFact') dialogFact!: ElementRef<HTMLDialogElement>;
  viewMode: PresentationViewMode = PresentationViewMode.VIEW;
  _selectedItemIndex: number = -1;
  factViewConfig: PresentationUIConfig = {};
  factLocal: FactLocal = {fact:{}};
  // [variables]
  // --------------------------------
  // [events]
  onAdd(): void {
    this.factViewConfig.mode = PresentationViewMode.CREATE,
      this.factViewConfig.title = 'Create Fact';
    this.factLocal = {fact:{}};
    this.openDialog(this.dialogFact.nativeElement);
  }
  onEdit(): void {
    if (this._selectedItemIndex < 0) {
      return;
    }
    this.factViewConfig.mode = PresentationViewMode.EDIT;
    this.factViewConfig.title = 'Edit Fact';
    this.factLocal = { index: this._selectedItemIndex, fact: this.facts[this._selectedItemIndex] };
    this.openDialog(this.dialogFact.nativeElement);
  }
  onDelete(): void {
    // this.personNames.splice(this._selectedItemIndex, 1);
  }
  onAddEvent(factLocal: FactLocal): void {
    if (factLocal.index != null) {
      throw new Error("Unexpected index");
    }
    this.facts.push(factLocal.fact);
  }
  onSaveEvent(factLocal: FactLocal): void {
    if (factLocal.index == null || factLocal.index != this._selectedItemIndex) {
      throw new Error("Unexpected index");
    }
    this.facts[factLocal.index] = factLocal.fact;
  }
  // [events]
  // --------------------------------
  constructor(
    private dataService: DataService
  ) {
    super();
  }
  getConfig(): SelectorUIConfig {
    const config: SelectorUIConfig = {
      title: 'Select Fact',
    };
    return config;
  }
  isActive(index: number) {
    return this._selectedItemIndex == index;
  }
  setSelectedItem(index: number) {
    this._selectedItemIndex = index;
  }
  getTypeTitle(fact: FactApi): string {
    return this.dataService.dictUri?.find(option => option.uri === fact.type)?.title ?? '';
  }
  getDateAsStr(fact: FactApi): string {
    return fact.date?.formal ?? '';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['facts']) {
      this._selectedItemIndex = this.facts.length > 0 ? 0 : -1;
    }
  }
  getPersonFact(): FactLocal | undefined {
    if (this._selectedItemIndex >= 0) {
      return { index: this._selectedItemIndex, fact: this.facts[this._selectedItemIndex] }
    }
    return undefined
  }
}
