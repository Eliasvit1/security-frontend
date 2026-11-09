import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo-area">
        <span className="shield-icon">🛡️</span>
        <div>
          <h1>Security Operations Dashboard</h1>
        </div>
      </div>

      <div className="header-right">
        {isAuthenticated && user ? (
          <div className="user-badge">
            <span className="user-avatar">
              {(user.username || 'U').charAt(0).toUpperCase()}
            </span>
            <span>
              <strong>{user.username}</strong>
            </span>
            <span className="user-role-tag">
              {Array.isArray(user.groups) ? user.groups[0] || 'member' : 'user'}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
              title="Terminate current session"
            >
              Logout
            </button>
          </div>
        ) : null}

        <div className="status-indicator">
          <span
            className={`pulse-dot ${
              isAuthenticated ? 'pulse-active' : 'pulse-idle'
            }`}
          ></span>
          <span>
            {isAuthenticated
              ? 'Session Active (Port 636 LDAPS)'
              : 'Protected by Fail2ban + TLS'}
          </span>
        </div>
      </div>
    </header>
  );
}
