// src/types/User.ts
export interface UserData {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  telefono?: string;

  photo?: string;
  picture?: string;
  url_photo?: string;

  ubicacion?: {
    direccion?: string;
    departamento?: string;
    pais?: string;
  };

  [key: string]: unknown;
}