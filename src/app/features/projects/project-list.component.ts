import { Component, OnInit } from '@angular/core';
import { ProjectService } from './project.service';
import { Project } from './project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredStatus = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.projectService.getAll().subscribe(data => {
      this.projects = data;
    });
  }
}
