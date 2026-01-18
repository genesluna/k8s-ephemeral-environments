# US-059: Environment Variables API Service

## User Story

**As a** platform administrator,
**I want** an API service that stores and distributes environment variables to PR environments,
**So that** developers can manage secrets without direct cluster access.

## Acceptance Criteria

- [ ] API service deployed in `platform` namespace
- [ ] GitHub OAuth device flow support for CLI authentication
- [ ] Validates user is a contributor to the repository before allowing changes
- [ ] Stores environment variables per project in Kubernetes Secrets
- [ ] Automatically propagates secrets to all existing PR namespaces when updated
- [ ] Exposes endpoint for deploy workflow to inject secrets into new namespaces
- [ ] API secured with TLS via existing Traefik ingress
- [ ] Resource footprint under 64MB memory
- [ ] Integrates with organization allowlist (US-034)

## Priority

**Should** - Required for CLI tool functionality

## Story Points

8

## Dependencies

- US-034: Organization Allowlist (for access control)

## Notes

- Single lightweight service, minimal infrastructure footprint
- Technology choice (Go/Node/Python) deferred to implementation time
- Secrets stored encrypted at rest by k3s
- No external dependencies (database, cache) - uses Kubernetes Secrets as storage
- Service account with permissions to manage Secrets across namespaces

## Technical Design

### Architecture

```
┌─────────────┐      ┌─────────────────────────────────┐
│ k8s-ee CLI  │─────▶│ k8s-ee-api (platform namespace) │
│             │ HTTPS│                                 │
└─────────────┘      └───────────────┬─────────────────┘
                                     │ ServiceAccount
                                     ▼
                     ┌───────────────────────────────────┐
                     │ Kubernetes API                    │
                     │ - Read/write Secrets              │
                     │ - List namespaces                 │
                     └───────────────────────────────────┘
```

### API Endpoints

```
# Authentication
POST /auth/device/code           # Start device flow, returns user_code
POST /auth/device/token          # Poll for token after user authorizes

# Environment Variables
GET    /projects/:id/env         # List keys (values masked unless ?reveal=true)
PUT    /projects/:id/env         # Set one or more key-values
DELETE /projects/:id/env/:key    # Delete a single key

# Workflow Integration
POST   /projects/:id/env/inject/:namespace  # Copy secrets to namespace
```

### Storage Model

Project secrets stored in `platform` namespace:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: project-env-myapp
  namespace: platform
  labels:
    k8s-ee.dev/type: project-env
    k8s-ee.dev/project-id: myapp
type: Opaque
data:
  DATABASE_URL: base64(...)
  API_KEY: base64(...)
```

### Automatic Propagation

When secrets are updated via `PUT /projects/:id/env`:

1. Update master secret in `platform` namespace
2. List namespaces matching `{project-id}-pr-*`
3. For each namespace, create/update secret `env-vars`
4. Return success with count of updated namespaces

### Authorization Flow

1. CLI sends GitHub access token in `Authorization` header
2. API calls GitHub API to get user info
3. API checks if user is contributor to repo (`GET /repos/:owner/:repo/collaborators/:username`)
4. API checks if org is in allowed-orgs.json (reuse US-034 logic)
5. If all checks pass, allow the operation

### Resource Requirements

```yaml
resources:
  requests:
    memory: "32Mi"
    cpu: "10m"
  limits:
    memory: "64Mi"
    cpu: "100m"
```

### Deployment

- Helm chart in `charts/k8s-ee-api/`
- Exposed at `api.k8s-ee.genesluna.dev`
- TLS via Traefik + Let's Encrypt (existing setup)
