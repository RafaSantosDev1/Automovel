import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly baseUrl = `${environment.apiUrl}/vehicles`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(payload: { licensePlate: string; brand: string; model: string; year: number; mileage: number; customerId: number }): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, payload).pipe(catchError(this.handleError));
  }

  update(id: number, payload: { licensePlate: string; brand: string; model: string; year: number; mileage: number; customerId: number }): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  patch(id: number, payload: { licensePlate?: string; brand?: string; model?: string; year?: number; mileage?: number; customerId?: number }): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.baseUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  getCustomers(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<{ id: number; name: string; email: string; phoneNumber: string }[]>(`${environment.apiUrl}/customers`)
      .pipe(
        map((data) => data.map((c) => ({ id: c.id, name: c.name }))),
        catchError(() => throwError(() => new Error('Erro ao carregar clientes.')))
      );
  }

  getByCustomerId(customerId: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/customer/${customerId}`).pipe(catchError(this.handleError));
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