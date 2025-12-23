// src/__tests__/ProductList.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProductList from '../components/ProductList';
import * as productService from '../services/productService';

// Mock the productService
jest.mock('../services/productService', () => ({
  productService: {
    getAllProducts: jest.fn()
  }
}));

const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </MemoryRouter>
);

describe('ProductList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    (productService.productService.getAllProducts as jest.Mock).mockResolvedValue([]);

    render(
      <MockProvider>
        <ProductList />
      </MockProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders products after loading', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        createdAt: '2023-01-01T00:00:00.000Z',
        isActive: true
      }
    ];

    (productService.productService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

    render(
      <MockProvider>
        <ProductList />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  test('displays error message when API call fails', async () => {
    (productService.productService.getAllProducts as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <MockProvider>
        <ProductList />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});