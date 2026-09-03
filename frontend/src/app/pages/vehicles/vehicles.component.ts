import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { CustomerService } from '../../services/customer.service';
import { Vehicle } from '../../models/vehicle.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  customers: { id: number; name: string }[] = [];
  loading = true;
  error: string | null = null;
  form: FormGroup;
  editingId: number | null = null;
  showForm = false;
  isSaving = false;
  saveError: string | null = null;
  deleteTarget: Vehicle | null = null;
  searchTerm = '';

  constructor(
    private vehicleService: VehicleService,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      licensePlate: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [null as number | null, Validators.required],
      mileage: [null as number | null, Validators.required],
      customerId: [null as number | null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.vehicleService.getAll().subscribe({
      next: (data: Vehicle[]) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: (err: { message: string }) => {
        this.error = err.message;
        this.loading = false;
      }
    });
    this.vehicleService.getCustomers().subscribe({
      next: (data: { id: number; name: string }[]) => (this.customers = data),
      error: () => (this.customers = [])
    });
  }

  get filteredVehicles(): Vehicle[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.vehicles;
    return this.vehicles.filter((v) => {
      const customerName = this.getCustomerName(v.customerId).toLowerCase();
      return (
        v.licensePlate.toLowerCase().includes(term) ||
        v.brand.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term) ||
        customerName.includes(term)
      );
    });
  }

  openCreate(): void {
    this.showForm = true;
    this.editingId = null;
    this.form.reset();
    this.saveError = null;
  }

  openEdit(vehicle: Vehicle): void {
    this.showForm = true;
    this.editingId = vehicle.id;
    this.form.patchValue({
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      customerId: vehicle.customerId
    });
    this.saveError = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    this.saveError = null;
    const payload = this.form.getRawValue();
    const request = this.editingId
      ? this.vehicleService.update(this.editingId, payload as any)
      : this.vehicleService.create(payload as any);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;
        this.editingId = null;
        this.form.reset();
        this.load();
      },
      error: (err: { message: string }) => {
        this.isSaving = false;
        this.saveError = err.message;
      }
    });
  }

  confirmDelete(vehicle: Vehicle): void {
    this.deleteTarget = vehicle;
  }

  delete(): void {
    if (!this.deleteTarget) return;
    this.vehicleService.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.deleteTarget = null;
        this.load();
      },
      error: () => {
        this.deleteTarget = null;
      }
    });
  }

  getCustomerName(customerId: number): string {
    return this.customers.find((c) => c.id === customerId)?.name ?? `#${customerId}`;
  }
}