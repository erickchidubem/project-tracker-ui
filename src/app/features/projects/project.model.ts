export interface Project {
  id?: number;
  name: string;
  description: string;
  owner: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  startDate: string;
  endDate: string;
}