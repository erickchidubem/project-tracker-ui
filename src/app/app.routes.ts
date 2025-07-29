import { Routes } from '@angular/router';
import { ProjectListComponent } from './features/projects/project-list.component';
import { ProjectFormComponent } from './features/projects/project-form.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
 { path: 'projects', loadComponent: () => ProjectListComponent },
  { path: 'projects/new', loadComponent: () => ProjectFormComponent },
  { path: 'projects/:id', loadComponent: () => ProjectFormComponent },
  { path: 'reload-projects', redirectTo: 'projects', pathMatch: 'full' },
];
