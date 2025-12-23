// src/services/productService.ts
import api from './api';
import { Product, CreateProductDto, UpdateProductDto } from '../types/Product';

const PRODUCT_ENDPOINT = '/products';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>(PRODUCT_ENDPOINT);
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`${PRODUCT_ENDPOINT}/${id}`);
    return response.data;
  },

  createProduct: async (product: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>(PRODUCT_ENDPOINT, product);
    return response.data;
  },

  updateProduct: async (id: number, product: UpdateProductDto): Promise<Product> => {
    const response = await api.put<Product>(`${PRODUCT_ENDPOINT}/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`${PRODUCT_ENDPOINT}/${id}`);
  },
};