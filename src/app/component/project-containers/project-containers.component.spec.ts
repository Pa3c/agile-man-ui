import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContainersComponent } from './project-containers.component';

describe('ProjectContainersComponent', () => {
  let component: ProjectContainersComponent;
  let fixture: ComponentFixture<ProjectContainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectContainersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
