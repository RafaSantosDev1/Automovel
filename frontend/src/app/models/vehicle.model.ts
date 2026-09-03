export interface Vehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  customerId: number;
}

export interface VehicleCreateRequest {
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  customerId: number;
}

export interface VehicleUpdateRequest {
  licensePlate?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  customerId?: number;
}