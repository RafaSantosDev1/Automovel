export interface Customer {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface CustomerCreateRequest {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface CustomerUpdateRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
}