import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="alert-banner alert-warning">
          <div>
            <strong>🔒 Authentication Required:</strong> You need an active LDAP
            session to access <code>{location.pathname}</code>.
          </div>
        </div>
        <div className="card">
          <h2>Authentication Required</h2>
          <p className="card-desc">
            Please authenticate using your LDAP credentials over secure LDAPS
            (port 636) to generate your JWT Bearer session token.
          </p>
          <Navigate to="/login" replace state={{ from: location }} />
        </div>
      </div>
    );
  }

  return children;
}
