// src/components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import '../App.css';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Fullstack App</Link>
        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              <Link to="/products" className="nav-link">Products</Link>
              <span className="nav-user">Welcome, {user?.email || 'User'}</span>
              <button onClick={handleLogout} className="btn btn-secondary nav-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;