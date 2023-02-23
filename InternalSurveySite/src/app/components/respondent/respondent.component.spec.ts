import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondentComponent } from './respondent.component';

describe('RespondentComponent', () => {
  let component: RespondentComponent;
  let fixture: ComponentFixture<RespondentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespondentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespondentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
