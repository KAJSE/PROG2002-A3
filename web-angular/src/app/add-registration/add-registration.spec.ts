import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegistration } from './add-registration';

describe('AddRegistration', () => {
  let component: AddRegistration;
  let fixture: ComponentFixture<AddRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
