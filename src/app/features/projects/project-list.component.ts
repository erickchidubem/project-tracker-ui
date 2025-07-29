import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from './project.service';
import { ProjectApiPayload  } from './project.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule,NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    
  ]
})
export class ProjectListComponent implements OnInit,OnDestroy  {
  projects: ProjectApiPayload[] = [];
  filteredStatus: number = 0; // Default to 'Planned'
 private routeSub!: Subscription;
isLoading = false;

  constructor(private projectService: ProjectService,private router: Router) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.fetchProjects(); // reload when route re-activates
      });
  }
 ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
  fetchProjects(): void {
    this.isLoading = true;
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.isLoading = false;
      },
    });
  }

  get filteredProjects(): ProjectApiPayload[] {
    if (!this.filteredStatus) return this.projects;
    return this.projects.filter(p => p.status === this.filteredStatus);
  }
}
