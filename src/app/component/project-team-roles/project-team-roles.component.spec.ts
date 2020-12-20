import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTeamRolesComponent } from './project-team-roles.component';

describe('ProjectTeamRolesComponent', () => {
  let component: ProjectTeamRolesComponent;
  let fixture: ComponentFixture<ProjectTeamRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTeamRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTeamRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
