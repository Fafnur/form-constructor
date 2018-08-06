import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiedListComponent } from './modified-list.component';

describe('ModifiedListComponent', () => {
  let component: ModifiedListComponent;
  let fixture: ComponentFixture<ModifiedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifiedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifiedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
