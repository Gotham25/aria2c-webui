import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateFilterChipHolderComponent } from './state-filter-chip-holder.component';

describe('StateFilterChipHolderComponent', () => {
  let component: StateFilterChipHolderComponent;
  let fixture: ComponentFixture<StateFilterChipHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateFilterChipHolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateFilterChipHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
