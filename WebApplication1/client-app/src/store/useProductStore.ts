// src/store/useProductStore.ts
import { create } from 'zustand';
import { Product } from '../types/Product';
import { productService } from '../services/productService';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productService.getAllProducts();
      set({ products, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch products', loading: false });
    }
  },
  
  fetchProductById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const product = await productService.getProductById(id);
      set({ selectedProduct: product, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch product', loading: false });
    }
  },
  
  createProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await productService.createProduct(product as any);
      set((state) => ({ products: [...state.products, newProduct], loading: false }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to create product', loading: false });
    }
  },
  
  updateProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await productService.updateProduct(id, product as any);
      set((state) => ({
        products: state.products.map(p => p.id === id ? updatedProduct : p),
        selectedProduct: updatedProduct,
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update product', loading: false });
    }
  },
  
  deleteProduct: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete product', loading: false });
    }
  },
}));