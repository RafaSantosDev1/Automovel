import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingSpinnerComponent, ConfirmDialogComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  error: string | null = null;
  form: FormGroup;
  editingId: number | null = null;
  showForm = false;
  isSaving = false;
  saveError: string | null = null;
  vehiclesOfCustomer: { id: number; licensePlate: string; brand: string; model: string }[] = [];
  selectedCustomerId: number | null = null;
  deleteTarget: Customer | null = null;
  searchTerm = '';

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.customerService.getAll().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err: { message: string }) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  get filteredCustomers(): Customer[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.customers;
    return this.customers.filter((c) =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phoneNumber.toLowerCase().includes(term)
    );
  }

  openCreate(): void {
    this.showForm = true;
    this.editingId = null;
    this.form.reset();
    this.saveError = null;
  }

  openEdit(customer: Customer): void {
    this.showForm = true;
    this.editingId = customer.id;
    this.form.patchValue({
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber
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
      ? this.customerService.update(this.editingId, payload)
      : this.customerService.create(payload);

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

  confirmDelete(customer: Customer): void {
    this.deleteTarget = customer;
  }

  delete(): void {
    if (!this.deleteTarget) return;
    this.customerService.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.deleteTarget = null;
        this.load();
      },
      error: () => {
        this.deleteTarget = null;
      }
    });
  }

  viewVehicles(customerId: number): void {
    this.selectedCustomerId = customerId;
    this.customerService.getVehicles(customerId).subscribe({
      next: (data: { id: number; licensePlate: string; brand: string; model: string }[]) => (this.vehiclesOfCustomer = data),
      error: () => (this.vehiclesOfCustomer = [])
    });
  }

  goToNewVehicle(): void {
    this.router.navigate(['/vehicles']);
  }
}