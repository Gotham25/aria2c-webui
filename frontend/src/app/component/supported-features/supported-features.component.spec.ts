import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportedFeaturesComponent } from './supported-features.component';

describe('SupportedFeaturesComponent', () => {
  let component: SupportedFeaturesComponent;
  let fixture: ComponentFixture<SupportedFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportedFeaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportedFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
