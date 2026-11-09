import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavigationTabs from './components/NavigationTabs';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ApiExplorerPage from './pages/ApiExplorerPage';
import SecurityStatusPage from './pages/SecurityStatusPage';

export default function App() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <NavigationTabs />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/explorer" element={<ApiExplorerPage />} />
          <Route path="/security" element={<SecurityStatusPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Enterprise Security Dashboard (React + LDAPS + Fail2ban) | Isolated Network 172.29.0.0/24</p>
      </footer>
    </div>
  );
}
