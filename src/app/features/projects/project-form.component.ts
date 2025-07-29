import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from './project.service';
import { ProjectApiPayload,toApiPayload, ProjectFormModel } from './project.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule 
  ]
})
export class ProjectFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  projectId!: number;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.projectId = +id;
      this.projectService.getById(this.projectId).subscribe(project => {
        this.form.patchValue(project);
      });
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['Planned'],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  goBack():void {
   this.router.navigateByUrl('/reload-projects');
}

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value as ProjectFormModel;
    const project = toApiPayload(formValue);
   
    if (this.isEditMode) {
      this.projectService.update(this.projectId, project).subscribe(() => {
        this.router.navigate(['/projects']);
      });
    } else {
      this.projectService.create(project).subscribe(() => {
        this.router.navigate(['/projects']);
      });
    }
  }

  private mapStatusStringToEnum(status: string): number {
  switch (status) {
    case 'Planned': return 0;
    case 'In Progress': return 1;
    case 'Completed': return 2;
    default: return 0;
  }
}
}
