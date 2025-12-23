// src/components/ProductForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productCreateSchema, productUpdateSchema, ProductCreateData, ProductUpdateData } from '../schemas/productSchema';
import { productService } from '../services/productService';
import '../App.css';

interface ProductFormProps {
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<ProductCreateData | ProductUpdateData>({
    resolver: zodResolver(isEdit ? productUpdateSchema : productCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      isActive: true
    }
  });

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(Number(id)),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (isEdit && product) {
      reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive
      });
    }
  }, [isEdit, product, reset]);

  const createMutation = useMutation({
    mutationFn: (newProduct: ProductCreateData) => productService.createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdateData }) => 
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      navigate('/products');
    },
  });

  const onSubmit = async (data: ProductCreateData | ProductUpdateData) => {
    if (isEdit && id) {
      updateMutation.mutate({ id: Number(id), data: data as ProductUpdateData });
    } else {
      createMutation.mutate(data as ProductCreateData);
    }
  };

  if (isEdit && isProductLoading) {
    return <div className="loading">Loading product...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="form-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h2>{isEdit ? 'Edit Product' : 'Create New Product'}</h2>
        <p className="form-subtitle">
          {isEdit 
            ? 'Update the product information below' 
            : 'Fill in the product details to create a new listing'}
        </p>
      </div>
      
      {(createMutation.error || updateMutation.error) && (
        <div className="error">
          Error: {createMutation.error?.message || updateMutation.error?.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <div className="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <input
                type="text"
                id="name"
                {...register('name')}
                className={errors.name ? 'error' : ''}
                placeholder="Enter product name"
              />
            </div>
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <div className="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <input
                type="number"
                id="price"
                {...register('price', { valueAsNumber: true })}
                className={errors.price ? 'error' : ''}
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
            </div>
            {errors.price && <p className="error-text">{errors.price.message}</p>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <div className="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              placeholder="Enter product description"
            />
          </div>
          {errors.description && <p className="error-text">{errors.description.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <div className="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="text"
              id="imageUrl"
              {...register('imageUrl')}
              placeholder="Enter image URL"
            />
          </div>
          {errors.imageUrl && <p className="error-text">{errors.imageUrl.message}</p>}
        </div>
        
        {isEdit && (
          <div className="form-group">
            <label htmlFor="isActive">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="checkbox-input"
              />
              <span className="checkbox-label">Active Product</span>
            </label>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className="btn btn-primary"
          >
            {isSubmitting || createMutation.isPending || updateMutation.isPending 
              ? (
                <>
                  <svg className="btn-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              )
              : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/products')} 
            className="btn btn-outline"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;