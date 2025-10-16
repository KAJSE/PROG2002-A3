import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamBackground } from './dream-background';

describe('DreamBackground', () => {
  let component: DreamBackground;
  let fixture: ComponentFixture<DreamBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DreamBackground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DreamBackground);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
