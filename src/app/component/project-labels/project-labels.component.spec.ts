import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLabelsComponent } from './project-labels.component';

describe('ProjectLabelsComponent', () => {
  let component: ProjectLabelsComponent;
  let fixture: ComponentFixture<ProjectLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectLabelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
