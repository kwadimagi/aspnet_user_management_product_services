// src/components/Login.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { loginSchema, LoginFormData } from '../schemas/authSchema';
import '../App.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, setError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    await login(data);
    
    // If login was successful, the state update will redirect automatically
    // If not, an error will be shown
  };

  return (
    <div className="form-container">
      <div className="login-header">
        <div className="login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <input
              type="password"
              id="password"
              {...register('password')}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
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
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </div>
      </form>
      
      <div className="auth-links">
        <p className="signup-text">
          Don't have an account? <Link to="/register" className="link">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;