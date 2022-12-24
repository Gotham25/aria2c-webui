import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl} from "@angular/forms";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-state-filter-chip-holder',
  templateUrl: './state-filter-chip-holder.component.html',
  styleUrls: ['./state-filter-chip-holder.component.scss']
})
export class StateFilterChipHolderComponent implements OnInit, AfterViewInit {

  states: string[] = [...environment.availableStates].filter(e => e != 'Paused' && e != 'Removed');
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  stateCtrl = new FormControl();
  allStates: string[] = environment.availableStates;
  filteredStates: Observable<string[]>;

  @Output() notifyStateChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  @ViewChild("stateInput") stateInput!: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete!: MatAutocomplete;

  constructor() {
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit
          ? this.getUniqueList(this._filter(fruit))
          : this.getUniqueList(this.allStates.slice())
      )
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.notifyStateChange.emit(this.states);
    }, 10);
  }

  getUniqueList(fruitList: string[]): string[] {
    return fruitList.filter(x => this.states.indexOf(x) === -1);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      const filterList = this.getUniqueList(this.allStates);
      const index = filterList.indexOf(event.value);
      if (index > -1) {
        this.states.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.stateCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.states.indexOf(fruit);

    if (index >= 0) {
      this.states.splice(index, 1);
    }
    this.stateCtrl.updateValueAndValidity();
    //console.log("this.states", this.states);
    this.notifyStateChange.emit(this.states);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.states.push(event.option.viewValue);
    //console.log("this.states", this.states);
    this.notifyStateChange.emit(this.states);
    this.stateInput.nativeElement.value = "";
    this.stateCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allStates.filter(
      fruit => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
