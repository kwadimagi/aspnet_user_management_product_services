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
        imageUrl: product.imageUrl || ''
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
      <h2>{isEdit ? 'Edit Product' : 'Create New Product'}</h2>
      
      {(createMutation.error || updateMutation.error) && (
        <div className="error">
          Error: {createMutation.error?.message || updateMutation.error?.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <p className="error-text">{typeof errors.name.message === 'string' ? errors.name.message : ''}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
          />
          {errors.description && <p className="error-text">{typeof errors.description.message === 'string' ? errors.description.message : ''}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price *</label>
          <input
            type="number"
            id="price"
            {...register('price', { valueAsNumber: true })}
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <p className="error-text">{typeof errors.price.message === 'string' ? errors.price.message : ''}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            {...register('imageUrl')}
          />
          {errors.imageUrl && <p className="error-text">{typeof errors.imageUrl.message === 'string' ? errors.imageUrl.message : ''}</p>}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className="btn btn-primary"
          >
            {isSubmitting || createMutation.isPending || updateMutation.isPending 
              ? (isEdit ? 'Updating...' : 'Creating...') 
              : (isEdit ? 'Update' : 'Create')}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/products')} 
            className="btn btn-secondary"
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