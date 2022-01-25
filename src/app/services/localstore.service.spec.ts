import { TestBed } from '@angular/core/testing';

import { LocalstoreService } from './localstore.service';

describe('LocalstoreService', () => {
  let service: LocalstoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
