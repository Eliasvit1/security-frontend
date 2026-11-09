import React, { useState } from 'react';
import { useAuth, BACKEND_API_URL } from '../context/AuthContext';

export default function ApiExplorerPage() {
  const { authFetch, isAuthenticated } = useAuth();
  const [output, setOutput] = useState({ info: 'Select an API operation to test.' });
  const [statusBadge, setStatusBadge] = useState({ type: 'idle', text: 'Awaiting Query' });
  const [postPayload, setPostPayload] = useState('{\n  "event": "security_audit_test",\n  "severity": "info",\n  "system": "node_sensor_01"\n}');

  // 1. GET /api/data (Authenticated with Session)
  const handleGetData = async () => {
    if (!isAuthenticated) {
      setStatusBadge({ type: 'error', text: 'No active session token' });
      setOutput({ warning: 'Please authenticate via LDAP first to acquire JWT token.' });
      return;
    }

    setStatusBadge({ type: 'loading', text: 'Querying /api/data...' });
    try {
      const res = await authFetch(`${BACKEND_API_URL}/api/data`, { method: 'GET' });
      const data = await res.json();
      if (res.ok) {
        setStatusBadge({ type: 'success', text: `${res.status} OK` });
        setOutput(data);
      } else {
        setStatusBadge({ type: 'error', text: `Error ${res.status}` });
        setOutput(data);
      }
    } catch (err) {
      setStatusBadge({ type: 'error', text: 'Network Error' });
      setOutput({ error: err.message });
    }
  };

  // 2. POST /api/data (Authenticated with Session)
  const handlePostData = async () => {
    if (!isAuthenticated) {
      setStatusBadge({ type: 'error', text: 'No active session token' });
      setOutput({ warning: 'Please authenticate via LDAP first.' });
      return;
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(postPayload);
    } catch {
      setStatusBadge({ type: 'error', text: 'Invalid JSON payload' });
      setOutput({ error: 'Please enter a valid JSON format in the POST payload textarea.' });
      return;
    }

    setStatusBadge({ type: 'loading', text: 'Sending POST /api/data...' });
    try {
      const res = await authFetch(`${BACKEND_API_URL}/api/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusBadge({ type: 'success', text: `${res.status} Created` });
        setOutput(data);
      } else {
        setStatusBadge({ type: 'error', text: `Error ${res.status}` });
        setOutput(data);
      }
    } catch (err) {
      setStatusBadge({ type: 'error', text: 'Network Error' });
      setOutput({ error: err.message });
    }
  };

  // 3. GET /health (Public Unauthenticated Endpoint)
  const handleHealthCheck = async () => {
    setStatusBadge({ type: 'loading', text: 'Checking /health...' });
    try {
      const res = await fetch(`${BACKEND_API_URL}/health`);
      const data = await res.json();
      setStatusBadge({ type: 'success', text: `${res.status} OK` });
      setOutput(data);
    } catch (err) {
      setStatusBadge({ type: 'error', text: 'Service Down' });
      setOutput({ error: err.message });
    }
  };

  // 4. Test 401 Unauthorized (Intentionally call without Token to test protection)
  const handleTest401 = async () => {
    setStatusBadge({ type: 'loading', text: 'Testing 401 Unauthorized...' });
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/data`, {
        method: 'GET',
        headers: { Accept: 'application/json' }, // Intentionally missing Bearer header
      });

      const data = await res.json();
      if (res.status === 401) {
        setStatusBadge({ type: 'error', text: '401 Unauthorized (Protection Verified)' });
        setOutput({
          http_status: 401,
          protection: 'Bearer Token verification working correctly',
          backend_response: data,
        });
      } else {
        setStatusBadge({ type: 'idle', text: `Status ${res.status}` });
        setOutput(data);
      }
    } catch (err) {
      setStatusBadge({ type: 'error', text: 'Network Error' });
      setOutput({ error: err.message });
    }
  };

  const getStatusClass = (type) => {
    switch (type) {
      case 'loading': return 'status-loading';
      case 'success': return 'status-success';
      case 'error': return 'status-error';
      default: return 'status-idle';
    }
  };

  return (
    <div className="page-container">
      <div className="grid-layout">
        {/* GET Operations */}
        <section className="card">
          <h2>⚡ Read Operations (GET)</h2>
          <p className="card-desc">
            Test protected and public endpoints using the multi-page authenticated session.
          </p>

          <div className="button-group">
            <button onClick={handleGetData} className="btn btn-primary">
              Query GET /api/data
            </button>
            <button onClick={handleHealthCheck} className="btn btn-secondary">
              Check GET /health
            </button>
            <button onClick={handleTest401} className="btn btn-danger">
              Test 401 Unauthorized
            </button>
          </div>

          <div className={`status-badge ${getStatusClass(statusBadge.type)}`}>
            {statusBadge.text}
          </div>
        </section>

        {/* POST Operations */}
        <section className="card">
          <h2>📝 Write Operations (POST)</h2>
          <p className="card-desc">
            Post structured payloads to <code>/api/data</code> authorized by your session token.
          </p>

          <div className="form-group">
            <label htmlFor="post-payload">JSON Request Body:</label>
            <textarea
              id="post-payload"
              rows={4}
              value={postPayload}
              onChange={(e) => setPostPayload(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button onClick={handlePostData} className="btn btn-primary" style={{ width: '100%' }}>
            Send POST /api/data
          </button>
        </section>

        {/* Telemetry Output Box */}
        <section className="card telemetry-card">
          <h2>Service Response & Telemetry Output</h2>
          <pre className="console-box">{JSON.stringify(output, null, 2)}</pre>
        </section>
      </div>
    </div>
  );
}
