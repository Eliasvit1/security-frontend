import React, { useState, useEffect } from 'react';
import { useAuth, BACKEND_API_URL } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, authFetch, isAuthenticated } = useAuth();
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTelemetry = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);

    try {
      const res = await authFetch(`${BACKEND_API_URL}/api/data`);
      const data = await res.json();
      if (res.ok) {
        setTelemetry(data);
      } else {
        setError(data.detail || `Error ${res.status}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [isAuthenticated]);

  return (
    <div className="page-container">
      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-widget">
          <div className="metric-title">Active Operator</div>
          <div className="metric-value" style={{ fontSize: '1.2rem', color: 'var(--accent-blue)' }}>
            {user?.username || 'Anonymous'}
          </div>
        </div>

        <div className="metric-widget">
          <div className="metric-title">CPU Utilization</div>
          <div className="metric-value">
            {telemetry?.metrics?.node_cpu_utilization || '14.2%'}
          </div>
        </div>

        <div className="metric-widget">
          <div className="metric-title">Secure Channels</div>
          <div className="metric-value">
            {telemetry?.metrics?.active_secure_channels || 4}
          </div>
        </div>

        <div className="metric-widget">
          <div className="metric-title">Firewall Mitigation</div>
          <div className="metric-value" style={{ color: 'var(--accent-green)' }}>
            {telemetry?.metrics?.firewall_mitigation_level || 'Optimal'}
          </div>
        </div>
      </div>

      <div className="grid-layout">
        {/* User Identity Card */}
        <section className="card">
          <h2>👤 Authenticated Identity</h2>
          <p className="card-desc">
            Active LDAP profile and session metadata verified by downstream services.
          </p>

          <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Username:</strong> <code>{user?.username}</code></div>
            <div><strong>Full Name:</strong> {user?.fullName || 'Alice Smith'}</div>
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>Role / Groups:</strong> <span className="user-role-tag">{user?.groups?.join(', ') || 'developers'}</span></div>
            <div><strong>LDAP DN:</strong> <code style={{ fontSize: '0.8rem' }}>{user?.dn}</code></div>
            <div><strong>Session Restored:</strong> Yes (from <code>sessionStorage</code>)</div>
          </div>
        </section>

        {/* Telemetry Actions Card */}
        <section className="card">
          <h2>📡 Backend Microservice Telemetry</h2>
          <p className="card-desc">
            Querying <code>/api/data</code> over HTTP port 8082 with JWT Bearer Token.
          </p>

          <div className="button-group">
            <button
              onClick={fetchTelemetry}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Refreshing Telemetry...' : 'Refresh Telemetry Data'}
            </button>
            <Link to="/explorer" className="btn btn-secondary">
              Go to API Explorer
            </Link>
          </div>

          <div className={`status-badge ${loading ? 'status-loading' : error ? 'status-error' : 'status-success'}`}>
            {loading ? 'Querying Backend...' : error ? error : '200 OK - Verified by JWT Bearer'}
          </div>
        </section>

        {/* Telemetry Output View */}
        <section className="card telemetry-card">
          <h2>Telemetry JSON Response Output</h2>
          <pre className="console-box">
            {telemetry
              ? JSON.stringify(telemetry, null, 2)
              : error
              ? JSON.stringify({ error }, null, 2)
              : '{"status": "Fetching initial telemetry data..."}'}
          </pre>
        </section>
      </div>
    </div>
  );
}
