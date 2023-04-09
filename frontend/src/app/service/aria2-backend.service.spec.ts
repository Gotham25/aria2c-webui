import { TestBed } from '@angular/core/testing';

import { Aria2BackendService } from './aria2-backend.service';

describe('Aria2BackendService', () => {
  let service: Aria2BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Aria2BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
