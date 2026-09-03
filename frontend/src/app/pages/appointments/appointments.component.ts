import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { VehicleService } from '../../services/vehicle.service';
import { Appointment, AppointmentStatus } from '../../models/appointment.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  vehicles: { id: number; licensePlate: string; brand: string; model: string }[] = [];
  loading = true;
  error: string | null = null;
  form: FormGroup;
  editingId: number | null = null;
  showForm = false;
  isSaving = false;
  saveError: string | null = null;
  deleteTarget: Appointment | null = null;
  statuses: AppointmentStatus[] = ['SCHEDULED', 'CANCELLED', 'COMPLETED'];

  constructor(
    private appointmentService: AppointmentService,
    private vehicleService: VehicleService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      vehicleId: [null as number | null, Validators.required],
      appointmentDate: ['', Validators.required],
      description: [''],
      status: ['SCHEDULED' as AppointmentStatus, Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
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
    this.appointmentService.getVehicles().subscribe({
      next: (data: { id: number; licensePlate: string; brand: string; model: string }[]) => (this.vehicles = data),
      error: () => (this.vehicles = [])
    });
  }

  openCreate(): void {
    this.showForm = true;
    this.editingId = null;
    this.form.reset({ status: 'SCHEDULED' });
    this.saveError = null;
  }

  openEdit(appt: Appointment): void {
    this.showForm = true;
    this.editingId = appt.id;
    this.form.patchValue({
      vehicleId: appt.vehicleId,
      appointmentDate: appt.appointmentDate,
      description: appt.description,
      status: appt.status
    });
    this.saveError = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.form.reset({ status: 'SCHEDULED' });
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    this.saveError = null;
    const payload = this.form.getRawValue();
    const request = this.editingId
      ? this.appointmentService.update(this.editingId, payload as any)
      : this.appointmentService.create(payload as any);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;
        this.editingId = null;
        this.form.reset({ status: 'SCHEDULED' });
        this.load();
      },
      error: (err: { message: string }) => {
        this.isSaving = false;
        this.saveError = err.message;
      }
    });
  }

  confirmDelete(appt: Appointment): void {
    this.deleteTarget = appt;
  }

  delete(): void {
    if (!this.deleteTarget) return;
    this.appointmentService.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.deleteTarget = null;
        this.load();
      },
      error: () => {
        this.deleteTarget = null;
      }
    });
  }

  getVehicleLabel(vehicleId: number): string {
    const v = this.vehicles.find((x) => x.id === vehicleId);
    return v ? `${v.licensePlate} — ${v.brand} ${v.model}` : `#${vehicleId}`;
  }

  statusClass(status: AppointmentStatus): string {
    switch (status) {
      case 'SCHEDULED':
        return 'status-scheduled';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return '';
    }
  }

  formatDate(value: string): string {
    const d = new Date(value);
    return d.toLocaleString('pt-PT');
  }
}