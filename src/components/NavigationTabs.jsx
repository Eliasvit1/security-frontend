import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavigationTabs() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="nav-bar">
      <NavLink
        to="/login"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        🔐 {isAuthenticated ? 'Session / Profile' : 'LDAP Login'}
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        📊 Dashboard & Telemetry
      </NavLink>

      <NavLink
        to="/explorer"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        ⚡ API Explorer (/api/data)
      </NavLink>

      <NavLink
        to="/security"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        🛡️ Security & Audit
      </NavLink>
    </nav>
  );
}
