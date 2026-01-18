# Tasks for US-059: Environment Variables API Service

## Tasks

### T-059.1: Project Setup
- **Description:** Initialize API project with chosen framework
- **Acceptance Criteria:**
  - Project structure created
  - HTTP framework configured (Gin/Echo/Express/FastAPI - TBD)
  - Health check endpoint (`/health`)
  - Structured logging
  - Graceful shutdown handling
  - Dockerfile for ARM64
- **Estimate:** S
- **Files:** `services/k8s-ee-api/`

### T-059.2: Kubernetes Client Setup
- **Description:** Configure Kubernetes client for Secret management
- **Acceptance Criteria:**
  - In-cluster authentication via ServiceAccount
  - Can create/read/update/delete Secrets
  - Can list namespaces by label selector
  - Error handling for API failures
- **Estimate:** S
- **Files:** `services/k8s-ee-api/internal/k8s/` or equivalent

### T-059.3: GitHub OAuth Device Flow
- **Description:** Implement device authorization grant flow
- **Acceptance Criteria:**
  - `POST /auth/device/code` returns device_code, user_code, verification_uri
  - `POST /auth/device/token` polls GitHub and returns access_token
  - Handles slow_down, authorization_pending, expired_token responses
  - Configurable GitHub OAuth App credentials via env vars
- **Estimate:** M
- **Files:** `services/k8s-ee-api/internal/auth/`

### T-059.4: Authorization Middleware
- **Description:** Implement request authorization
- **Acceptance Criteria:**
  - Extracts Bearer token from Authorization header
  - Validates token with GitHub API (`GET /user`)
  - Caches user info briefly to reduce GitHub API calls
  - Returns 401 for invalid/expired tokens
- **Estimate:** M
- **Files:** `services/k8s-ee-api/internal/middleware/`

### T-059.5: Repository Contributor Check
- **Description:** Verify user can modify project secrets
- **Acceptance Criteria:**
  - Maps project-id to repository (via stored metadata or convention)
  - Calls GitHub API to check collaborator status
  - Checks organization against allowed-orgs.json
  - Returns 403 for unauthorized users
  - Caches authorization for short period
- **Estimate:** M
- **Files:** `services/k8s-ee-api/internal/auth/`

### T-059.6: Secret Storage Layer
- **Description:** Implement CRUD for project secrets
- **Acceptance Criteria:**
  - Store secrets in `platform` namespace as `project-env-{projectId}`
  - Create secret if not exists
  - Update individual keys without losing others
  - Delete individual keys
  - List all keys (with option to include values)
- **Estimate:** M
- **Files:** `services/k8s-ee-api/internal/secrets/`

### T-059.7: Environment Variables Endpoints
- **Description:** Implement API endpoints for env management
- **Acceptance Criteria:**
  - `GET /projects/:id/env` returns list of keys
  - `GET /projects/:id/env?reveal=true` includes values (with audit log)
  - `PUT /projects/:id/env` accepts JSON object of key-values
  - `DELETE /projects/:id/env/:key` removes single key
  - All endpoints require authentication
- **Estimate:** M
- **Files:** `services/k8s-ee-api/internal/handlers/`

### T-059.8: Namespace Propagation
- **Description:** Automatically sync secrets to PR namespaces
- **Acceptance Criteria:**
  - On PUT, list all `{projectId}-pr-*` namespaces
  - Create/update `env-vars` Secret in each namespace
  - Return count of namespaces updated
  - Handle partial failures gracefully
  - Log propagation results
- **Estimate:** M
- **Files:** `services/k8s-ee-api/internal/secrets/propagation.go`

### T-059.9: Workflow Injection Endpoint
- **Description:** Endpoint for deploy workflow to get secrets
- **Acceptance Criteria:**
  - `POST /projects/:id/env/inject/:namespace` creates secret in target namespace
  - Validates namespace belongs to project (matches `{projectId}-pr-*`)
  - Uses service account token auth (not user auth)
  - Returns success/failure status
- **Estimate:** S
- **Files:** `services/k8s-ee-api/internal/handlers/`

### T-059.10: Helm Chart
- **Description:** Create Helm chart for deployment
- **Acceptance Criteria:**
  - Deployment with resource limits
  - ServiceAccount with RBAC for Secret management
  - Service for internal access
  - Ingress for external access (`api.k8s-ee.genesluna.dev`)
  - ConfigMap for configuration
  - Secret for GitHub OAuth credentials
  - Values for customization
- **Estimate:** M
- **Files:** `charts/k8s-ee-api/`

### T-059.11: Deploy Workflow Integration
- **Description:** Update deploy workflow to use API
- **Acceptance Criteria:**
  - Call injection endpoint after namespace creation
  - Handle case where no secrets exist for project
  - Add API token to workflow secrets
  - Update documentation
- **Estimate:** S
- **Files:** `.github/actions/create-namespace/action.yml`, `.github/workflows/`

### T-059.12: Documentation
- **Description:** Document API and operations
- **Acceptance Criteria:**
  - API reference documentation
  - Deployment guide
  - Troubleshooting guide
  - Security considerations
- **Estimate:** S
- **Files:** `docs/guides/env-api.md`

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
