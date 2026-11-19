import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Caught } from './caught';

describe('Caught', () => {
  let component: Caught;
  let fixture: ComponentFixture<Caught>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Caught],
    }).compileComponents();

    fixture = TestBed.createComponent(Caught);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
