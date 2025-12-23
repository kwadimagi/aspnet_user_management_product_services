// src/__tests__/ProductForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useParams } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import * as productService from '../services/productService';

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

// Mock the productService
jest.mock('../services/productService', () => ({
  productService: {
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn()
  }
}));

const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </MemoryRouter>
);

describe('ProductForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
  });

  test('renders form fields', () => {
    render(
      <MockProvider>
        <ProductForm />
      </MockProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const mockCreateProduct = jest.fn().mockResolvedValue({
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      createdAt: '2023-01-01T00:00:00.000Z',
      isActive: true
    });

    (productService.productService.createProduct as jest.Mock).mockImplementation(mockCreateProduct);

    render(
      <MockProvider>
        <ProductForm />
      </MockProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '15.99' } });

    fireEvent.click(screen.getByText(/create/i));

    await waitFor(() => {
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'New Product',
        description: 'New Description',
        price: 15.99,
        imageUrl: ''
      });
    });
  });

  test('loads existing product data in edit mode', async () => {
    const mockProduct = {
      id: 1,
      name: 'Existing Product',
      description: 'Existing Description',
      price: 19.99,
      createdAt: '2023-01-01T00:00:00.000Z',
      isActive: true
    };

    (productService.productService.getProductById as jest.Mock).mockResolvedValue(mockProduct);

    render(
      <MockProvider>
        <ProductForm isEdit={true} />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Product')).toBeInTheDocument();
    });
  });
});