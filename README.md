# Enterprise Security Operations Dashboard (React Frontend)

Refactored multi-page Single-Page Application (SPA) built with **React**, **Vite**, and **React Router DOM**, implementing persistent session state management across multiple pages with **LDAP Authentication (over LDAPS port 636)** and **JWT Bearer** authorization against downstream microservices.

---

## 1. Key Features & Architecture

* **Multi-Page Navigation (React Router v6):**
  * `🔐 /login`: LDAP authentication form with client-side XSS sanitization and regex validation. Displays active user profile upon successful authentication.
  * `📊 /dashboard`: Real-time telemetry dashboard querying protected endpoints with JWT bearer session, displaying live system metrics (CPU utilization, active secure channels, firewall mitigation status).
  * `⚡ /explorer`: Interactive API playground supporting `GET /api/data`, `POST /api/data`, `GET /health`, and intentional `401 Unauthorized` anti-pattern testing.
  * `🛡️ /security`: Defense-in-depth architecture overview detailing TLS LDAPS 636, Fail2ban mitigation, HTTP security headers, and rate limiting policies.
* **Persistent Session Management (`AuthContext`):**
  * Session credentials (`access_token` and `user` profile) are maintained via React Context and synchronized with browser `sessionStorage`.
  * The session seamlessly persists across all page transitions and page refreshes (F5).
  * Auto-terminates when the browser tab closes, following strict security standards.
  * Zero `console.log` credential leaks to protect tokens in browser DevTools.
* **Hardened Security & Audit Compliance:**
  * Client-side XSS entity encoding (`sanitizeInput`) and character whitelisting (`isValidUsername`).
  * Production Nginx reverse proxy configuration with `server_tokens off;`, `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy`.

---

## 2. Directory Structure

```text
security-frontend/
├── dist/                          # Production optimized build output
├── node_modules/
├── public/
├── security-reports/              # Nuclei DAST vulnerability reports & audit artifacts
│   ├── nuclei-scan.json
│   ├── nuclei-scan.txt
│   └── security-audit-report.md
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Header with logo, user badge, and session indicator
│   │   ├── NavigationTabs.jsx     # Navigation tabs across pages
│   │   └── ProtectedRoute.jsx     # Route guard redirecting unauthenticated users
│   ├── context/
│   │   └── AuthContext.jsx        # Global session provider & authFetch abstraction
│   ├── pages/
│   │   ├── ApiExplorerPage.jsx    # Protected GET/POST API tester
│   │   ├── DashboardPage.jsx      # Telemetry & metrics dashboard
│   │   ├── LoginPage.jsx          # LDAPS authentication & profile view
│   │   └── SecurityStatusPage.jsx # Security architecture & audit overview
│   ├── styles/
│   │   └── App.css                # Dark enterprise security theme
│   ├── utils/
│   │   └── sanitize.js            # XSS sanitization & input regex validation
│   ├── App.jsx                    # Route mapping
│   └── main.jsx                   # React root entrypoint
├── index.html                     # HTML root template with CSP & security meta headers
├── nginx.conf                     # Nginx server configuration with hardened headers
├── package.json
└── vite.config.js
```

---

## 3. Installation & Execution

### Prerequisites
* **Node.js**: v18+ (tested on Node v24)
* **npm**: v9+

### Development Server
To launch the Vite development server with Hot Module Replacement (HMR):
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
To generate the optimized production bundle in `dist/`:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

### Docker / Nginx Hosting
The generated `dist/` directory is mapped directly to `/usr/share/nginx/html/` in the containerized architecture, with `try_files $uri $uri/ /index.html;` configured in `nginx.conf` to handle client-side SPA routing.
