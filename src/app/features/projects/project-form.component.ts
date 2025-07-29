import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
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
      owner: ['', Validators.required],
      status: ['Planned'],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const project = this.form.value as Project;

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
}
