import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function SecurityStatusPage() {
  const { user, isAuthenticated, token } = useAuth();

  return (
    <div className="page-container">
      <div className="grid-layout">
        {/* Infrastructure Hardening */}
        <section className="card">
          <h2>🛡️ Infrastructure Defense</h2>
          <p className="card-desc">Hardened multi-tier container network architecture.</p>

          <div className="checklist-item">
            <span className="checklist-icon">🔒</span>
            <div className="checklist-content">
              <h4>TLS Encryption (LDAPS Port 636)</h4>
              <p>Directory authentication transmitted across an encrypted channel with validated certificates.</p>
            </div>
          </div>

          <div className="checklist-item">
            <span className="checklist-icon">⚡</span>
            <div className="checklist-content">
              <h4>Fail2ban HTTP Flood Defense</h4>
              <p>Linux iptables kernel packet filtering actively monitors Nginx access logs for DDoS spikes.</p>
            </div>
          </div>

          <div className="checklist-item">
            <span className="checklist-icon">🌐</span>
            <div className="checklist-content">
              <h4>Isolated Docker Network</h4>
              <p>Services bridged in isolated subnet <code>172.29.0.0/24</code> (<code>ddos_labnet</code>).</p>
            </div>
          </div>
        </section>

        {/* Application Security Measures */}
        <section className="card">
          <h2>🔐 Application Defense Layers</h2>
          <p className="card-desc">Audited and remediated according to Nuclei DAST findings.</p>

          <div className="checklist-item">
            <span className="checklist-icon">✅</span>
            <div className="checklist-content">
              <h4>HTTP Security Headers</h4>
              <p>Enforced CSP, <code>X-Frame-Options: DENY</code>, <code>X-Content-Type-Options: nosniff</code>, and suppressed server tokens.</p>
            </div>
          </div>

          <div className="checklist-item">
            <span className="checklist-icon">✅</span>
            <div className="checklist-content">
              <h4>Rate Limiting & Throttling</h4>
              <p>Client IP rate limits on <code>/login</code> (15 req/min) and <code>/api/data</code> (30 req/min) return 429.</p>
            </div>
          </div>

          <div className="checklist-item">
            <span className="checklist-icon">✅</span>
            <div className="checklist-content">
              <h4>Cross-Site Scripting (XSS) Sanitization</h4>
              <p>Client and server sanitize and validate usernames against strict whitelist patterns.</p>
            </div>
          </div>
        </section>

        {/* Active Session Status */}
        <section className="card telemetry-card">
          <h2>Active Session Integrity Telemetry</h2>
          <div style={{ marginBottom: '14px', fontSize: '0.9rem' }}>
            {isAuthenticated && user ? (
              <p>
                Session is active for <strong>{user.username}</strong>. The signed JWT Bearer is managed via React Context and persisted in <code>sessionStorage</code> across multiple pages.
              </p>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>
                No active session. Please authenticate via the LDAP Login page to initialize session state.
              </p>
            )}
          </div>

          <pre className="console-box">
            {JSON.stringify(
              {
                session_active: isAuthenticated,
                operator: user?.username || null,
                roles: user?.groups || [],
                storage_mechanism: 'sessionStorage (cleared on tab close)',
                xss_defense_active: true,
                console_logging_disabled: true,
                security_headers_status: 'Enforced',
                token_present: Boolean(token),
              },
              null,
              2
            )}
          </pre>
        </section>
      </div>
    </div>
  );
}
