// src/types/Product.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateProductDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
}