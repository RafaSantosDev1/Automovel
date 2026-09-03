import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Appointment, AppointmentStatus } from '../models/appointment.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly baseUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(payload: { vehicleId: number; appointmentDate: string; description: string; status: AppointmentStatus }): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, payload).pipe(catchError(this.handleError));
  }

  update(id: number, payload: { vehicleId: number; appointmentDate: string; description: string; status: AppointmentStatus }): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  patch(id: number, payload: Partial<{ vehicleId: number; appointmentDate: string; description: string; status: AppointmentStatus }>): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.baseUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  getVehicles(): Observable<{ id: number; licensePlate: string; brand: string; model: string }[]> {
    return this.http
      .get<{ id: number; licensePlate: string; model: string; brand: string; year: number; mileage: number; customerId: number }[]>(
        `${environment.apiUrl}/vehicles`
      )
      .pipe(
        map((data) => data.map((v) => ({ id: v.id, licensePlate: v.licensePlate, brand: v.brand, model: v.model }))),
        catchError((error) => throwError(() => new Error('Erro ao carregar veículos.')))
      );
  }

  private handleError(error: any) {
    let message = 'Erro ao processar a requisição.';
    if (error.status === 400) message = 'Dados inválidos.';
    else if (error.status === 404) message = 'Recurso não encontrado.';
    else if (error.status === 409) message = 'Conflito: recurso duplicado.';
    else if (error.status === 0) message = 'Erro de conexão com o servidor.';
    return throwError(() => new Error(message));
  }
}