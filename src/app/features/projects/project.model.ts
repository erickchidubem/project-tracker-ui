// Enum to reflect backend API status
export enum ProjectStatus {
  Planned = 0,
  InProgress = 1,
  Completed = 2
}


export interface ProjectFormModel {
  name: string;
  description: string;
  owner: string; 
  status: keyof typeof ProjectStatus; // 'Planned' | 'InProgress' | 'Completed'
  startDate: string; 
  endDate: string;
}


export interface ProjectApiPayload {
  id?: number; // Optional for create operations
  name: string;
  description: string;
  owner: string;
  startDate: string; 
  endDate: string;
  status: number;
}

// Helper to map form model to API payload
export function toApiPayload(form: ProjectFormModel): ProjectApiPayload {
  return {
    
    name: form.name,
    description: form.description,
    owner: form.owner,
    startDate: new Date(form.startDate).toISOString(),
    endDate: new Date(form.endDate).toISOString(),
    status: ProjectStatus[form.status] // converts 'Planned' → 0
  };
}
