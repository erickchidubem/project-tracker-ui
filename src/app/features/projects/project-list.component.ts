import { Component, OnInit, OnDestroy,ChangeDetectorRef  } from '@angular/core';
import { ProjectService } from './project.service';
import { ProjectApiPayload  } from './project.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe  } from '@angular/common';
import { RouterModule,NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ProjectStatusLabelPipe } from './project-status-label.pipe';
@Component({
  standalone: true,
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ProjectStatusLabelPipe,
    DatePipe
    
  ]
})
export class ProjectListComponent implements OnInit,OnDestroy  {
  projects: ProjectApiPayload[] = [];
  filteredStatus: string =''; // Default to 'All'
  private routeSub!: Subscription;
  isLoading = false;
  

  constructor(private projectService: ProjectService,private router: Router,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.filteredStatus = ''; // Default to 'Planned'
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

        console.log('Fetching projects...');
        console.log('Projects loaded:', data);
        this.projects = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Ensure view updates after async operation
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.isLoading = false;
      },
    });
  }

  get filteredProjects(): ProjectApiPayload[] {
   console.log('Filtering projects by status:', this.filteredStatus);
  if (this.filteredStatus === '') return this.projects;
  return this.projects.filter(p => p.status === Number(this.filteredStatus));
  }
}
