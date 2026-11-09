import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { isAuthenticated, user, status, login, logout } = useAuth();
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('alice123');
  const [localOutput, setLocalOutput] = useState({
    system: 'Ready for operations',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalOutput({ action: 'Authenticating credentials over secure LDAPS channel...' });

    const result = await login(username, password);
    if (result.success) {
      setLocalOutput({
        authenticated: true,
        user: result.user,
        token_type: 'bearer',
        session_storage: 'Session active and stored in sessionStorage across all pages',
      });
    } else {
      setLocalOutput({
        error: result.error,
        authenticated: false,
      });
    }
  };

  const getStatusClass = (type) => {
    switch (type) {
      case 'loading':
        return 'status-loading';
      case 'success':
        return 'status-success';
      case 'error':
        return 'status-error';
      default:
        return 'status-idle';
    }
  };

  return (
    <div className="page-container">
      <div className="grid-layout">
        {/* Authentication Card */}
        <section className="card auth-card">
          <h2>LDAP Authentication (Secure TLS/LDAPS)</h2>
          <p className="card-desc">
            Authenticate against directory server over port 636 TLS to acquire
            a signed JWT session token.
          </p>

          {isAuthenticated && user ? (
            <div>
              <div className="alert-banner alert-info" style={{ marginBottom: '16px' }}>
                <div>
                  <strong>Active Session:</strong> Authenticated as{' '}
                  <code>{user.username}</code> ({user.groups?.join(', ') || 'user'}).
                </div>
              </div>

              <div style={{ marginBottom: '16px', fontSize: '0.875rem' }}>
                <p><strong>Distinguished Name:</strong> <code>{user.dn}</code></p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Session Started:</strong> {user.loginTime}</p>
                <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                  Your session token is active across all dashboard tabs and pages.
                </p>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-primary"
                >
                  Go to Dashboard 📊
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/explorer')}
                  className="btn btn-secondary"
                >
                  Go to API Explorer ⚡
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="btn btn-danger"
                >
                  End Session
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  placeholder="e.g. alice"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  maxLength={64}
                  pattern="^[a-zA-Z0-9._@+-]{1,64}$"
                  title="Alphanumeric, dots, dashes, underscores, and email symbols only"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  placeholder="e.g. alice123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={status.type === 'loading'}
              >
                {status.type === 'loading'
                  ? 'Authenticating via LDAPS...'
                  : 'Authenticate via LDAPS'}
              </button>
            </form>
          )}

          <div className={`status-badge ${getStatusClass(status.type)}`}>
            {status.message}
          </div>
        </section>

        {/* Quick Session Overview Card */}
        <section className="card">
          <h2>Multi-Page Session Scope</h2>
          <p className="card-desc">
            Session persistence and token lifecycle overview.
          </p>

          <div className="checklist-item">
            <span className="checklist-icon">🔒</span>
            <div className="checklist-content">
              <h4>Session Storage Persistence</h4>
              <p>JWT bearer token is synchronized in memory & sessionStorage across all pages.</p>
            </div>
          </div>

          <div className="checklist-item">
            <span className="checklist-icon">🛡️</span>
            <div className="checklist-content">
              <h4>Zero Console Log Leaks</h4>
              <p>Strictly sanitized, credentials and raw signatures are never printed in DevTools.</p>
            </div>
          </div>

          <div className="checklist-item">
            <span className="checklist-icon">⚡</span>
            <div className="checklist-content">
              <h4>Protected Route Guard</h4>
              <p>Pages query microservices with Authorization Bearer header automatically.</p>
            </div>
          </div>
        </section>

        {/* Telemetry Output Box */}
        <section className="card telemetry-card">
          <h2>Authentication Response Output</h2>
          <pre className="console-box">{JSON.stringify(localOutput, null, 2)}</pre>
        </section>
      </div>
    </div>
  );
}
