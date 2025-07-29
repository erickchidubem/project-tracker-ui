import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectApiPayload} from './project.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private apiUrl = 'http://localhost:5002/api/projects';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectApiPayload[]> {
    return this.http.get<ProjectApiPayload[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProjectApiPayload> {
    return this.http.get<ProjectApiPayload>(`${this.apiUrl}/${id}`);
  }

  create(project: ProjectApiPayload): Observable<ProjectApiPayload> {
    return this.http.post<ProjectApiPayload>(this.apiUrl, project);
  }

  update(id: number, project: ProjectApiPayload): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
