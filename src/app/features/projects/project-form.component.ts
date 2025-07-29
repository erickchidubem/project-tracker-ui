import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from './project.service';
import { ProjectApiPayload, toApiPayload, ProjectFormModel } from './project.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export function dateRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return endDate > startDate ? null : { endBeforeStart: true };
  };
}


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
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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
    },
      {
        validators: [dateRangeValidator()]
      });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  goBack(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/projects']);
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value as ProjectFormModel;
    const project = toApiPayload(formValue);

    if (this.isEditMode) {
      this.projectService.update(this.projectId, project).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err) => {
          this.errorMessage = 'Failed to update project. Please try again.';
          setTimeout(() => this.errorMessage = null, 5000);
          console.error(err);
        }
      });
    } else {
      this.projectService.create(project).subscribe({
        next: () => this.router.navigate(['/projects']),
        error: (err) => {
          this.errorMessage = 'Failed to create project. Please try again.';
          setTimeout(() => this.errorMessage = null, 5000);
          console.error(err);
        }
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
