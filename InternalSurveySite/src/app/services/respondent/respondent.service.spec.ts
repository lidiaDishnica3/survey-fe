import { TestBed } from '@angular/core/testing';

import { RespondentService } from './respondent.service';

describe('RespondentService', () => {
  let service: RespondentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RespondentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
