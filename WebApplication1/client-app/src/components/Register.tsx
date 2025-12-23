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
      <div className="login-header">
        <div className="login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2>Create Account</h2>
        <p className="subtitle">Join our platform today</p>
      </div>
      
      {error && <div className="error">Error: {error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type="password"
              id="password"
              {...register('password')}
              className={errors.password ? 'error' : ''}
              placeholder="Create a password"
            />
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
          </div>
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <>
                <svg className="btn-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : 'Create Account'}
          </button>
        </div>
      </form>
      
      <div className="auth-links">
        <p className="signup-text">
          Already have an account? <Link to="/login" className="link">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;