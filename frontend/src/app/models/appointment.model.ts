export type AppointmentStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: number;
  vehicleId: number;
  appointmentDate: string;
  description: string;
  status: AppointmentStatus;
}

export interface AppointmentCreateRequest {
  vehicleId: number;
  appointmentDate: string;
  description: string;
  status: AppointmentStatus;
}

export interface AppointmentUpdateRequest {
  vehicleId?: number;
  appointmentDate?: string;
  description?: string;
  status?: AppointmentStatus;
}