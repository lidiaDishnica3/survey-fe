import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HasVotedPageComponent } from './has-voted-page.component';

describe('HasVotedPageComponent', () => {
  let component: HasVotedPageComponent;
  let fixture: ComponentFixture<HasVotedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HasVotedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HasVotedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
