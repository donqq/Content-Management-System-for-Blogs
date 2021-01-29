import { TestBed } from '@angular/core/testing';

import { ContentRecordsService } from './content-records.service';

describe('ContentRecordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentRecordsService = TestBed.get(ContentRecordsService);
    expect(service).toBeTruthy();
  });
});
