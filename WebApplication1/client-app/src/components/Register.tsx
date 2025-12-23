// src/components/Register.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { registerSchema, RegisterFormData } from '../schemas/authSchema';
import '../App.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, error, setError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    await registerUser(data);
    
    // If registration was successful, redirect to login after a delay
    if (!error) {
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      
      {error && <div className="error">Error: {error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={errors.email ? 'error' : ''}
          />
          {errors.email?.message && <p className="error-text">{errors.email.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className={errors.password ? 'error' : ''}
          />
          {errors.password?.message && <p className="error-text">{errors.password.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword?.message && <p className="error-text">{errors.confirmPassword.message}</p>}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
      
      <div className="auth-links">
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;