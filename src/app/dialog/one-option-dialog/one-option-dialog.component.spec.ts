import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOptionDialogComponent } from './one-option-dialog.component';

describe('OneOptionDialogComponent', () => {
  let component: OneOptionDialogComponent;
  let fixture: ComponentFixture<OneOptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneOptionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneOptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
