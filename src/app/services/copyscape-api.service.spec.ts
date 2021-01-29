import { TestBed } from '@angular/core/testing';

import { CopyscapeAPIService } from './copyscape-api.service';

describe('CopyscapeAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CopyscapeAPIService = TestBed.get(CopyscapeAPIService);
    expect(service).toBeTruthy();
  });
});
