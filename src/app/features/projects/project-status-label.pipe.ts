import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectStatusLabel',
  standalone: true
})
export class ProjectStatusLabelPipe implements PipeTransform {
  transform(status: number): string {
    switch (status) {
      case 0: return 'Planned';
      case 1: return 'In Progress';
      case 2: return 'Completed';
      default: return 'Unknown';
    }
  }
}
