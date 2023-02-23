import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuizPageComponent } from './user-quiz-page.component';

describe('UserQuizPageComponent', () => {
  let component: UserQuizPageComponent;
  let fixture: ComponentFixture<UserQuizPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserQuizPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQuizPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
