import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { VehicleService } from '../../services/vehicle.service';
import { AppointmentService } from '../../services/appointment.service';
import { Customer } from '../../models/customer.model';
import { Vehicle } from '../../models/vehicle.model';
import { Appointment } from '../../models/appointment.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  appointments: Appointment[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    this.customerService.getAll().subscribe({
      next: (data: Customer[]) => (this.customers = data),
      error: (err: { message: string }) => (this.error = err.message)
    });
    this.vehicleService.getAll().subscribe({
      next: (data: Vehicle[]) => (this.vehicles = data),
      error: (err: { message: string }) => (this.error = err.message)
    });
    this.appointmentService.getAll().subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data.sort(
          (a: Appointment, b: Appointment) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
        );
        this.loading = false;
      },
      error: (err: { message: string }) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  get upcomingAppointments(): Appointment[] {
    const now = new Date();
    return this.appointments
      .filter((a: Appointment) => new Date(a.appointmentDate) >= now && a.status === 'SCHEDULED')
      .slice(0, 5);
  }

  get pendingCount(): number {
    return this.appointments.filter((a) => a.status === 'SCHEDULED').length;
  }

  formatDate(value: string): string {
    const d = new Date(value);
    return d.toLocaleString('pt-PT');
  }
}