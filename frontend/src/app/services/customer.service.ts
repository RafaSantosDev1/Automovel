import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(payload: { name: string; email: string; phoneNumber: string }): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, payload).pipe(catchError(this.handleError));
  }

  update(id: number, payload: { name: string; email: string; phoneNumber: string }): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  patch(id: number, payload: { name?: string; email?: string; phoneNumber?: string }): Observable<Customer> {
    return this.http.patch<Customer>(`${this.baseUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  getVehicles(customerId: number): Observable<{ id: number; licensePlate: string; brand: string; model: string }[]> {
    return this.http
      .get<{ id: number; licensePlate: string; brand: string; model: string }[]>(
        `${this.baseUrl}/${customerId}/vehicles`
      )
      .pipe(catchError(this.handleError));
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