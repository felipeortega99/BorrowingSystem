import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentProductsComponent } from './rent-products.component';

describe('RentProductsComponent', () => {
  let component: RentProductsComponent;
  let fixture: ComponentFixture<RentProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
