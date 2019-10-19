import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePollComponent } from './delete-poll.component';

describe('DeletePollComponent', () => {
  let component: DeletePollComponent;
  let fixture: ComponentFixture<DeletePollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
