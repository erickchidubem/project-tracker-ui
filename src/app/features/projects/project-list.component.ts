import { Component, OnInit } from '@angular/core';
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  imports: [
    FormsModule,
    CommonModule
  ]
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredStatus: string = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      },
    });
  }

  get filteredProjects(): Project[] {
    if (!this.filteredStatus) return this.projects;
    return this.projects.filter(p => p.status === this.filteredStatus);
  }
}
