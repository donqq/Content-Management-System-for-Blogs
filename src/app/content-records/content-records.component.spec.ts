import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentRecordsComponent } from './content-records.component';

describe('ContentRecordsComponent', () => {
  let component: ContentRecordsComponent;
  let fixture: ComponentFixture<ContentRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
