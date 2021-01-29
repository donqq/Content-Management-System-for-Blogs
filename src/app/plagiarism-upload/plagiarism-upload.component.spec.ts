import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagiarismUploadComponent } from './plagiarism-upload.component';

describe('PlagiarismUploadComponent', () => {
  let component: PlagiarismUploadComponent;
  let fixture: ComponentFixture<PlagiarismUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlagiarismUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlagiarismUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
