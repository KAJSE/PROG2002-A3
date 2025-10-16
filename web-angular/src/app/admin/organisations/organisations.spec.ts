import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Organisations } from './organisations';

describe('Organisations', () => {
  let component: Organisations;
  let fixture: ComponentFixture<Organisations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Organisations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Organisations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
