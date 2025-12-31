# US-030: Create Reusable Composite Actions

**Status:** Done

## User Story

**As a** platform maintainer,
**I want** reusable composite actions for each deployment step,
**So that** the workflow logic is modular and easy to maintain.

## Acceptance Criteria

- [x] `validate-config` action parses and validates k8s-ee.yaml
- [x] `setup-tools` action installs kubectl and helm with caching
- [x] `create-namespace` action creates namespace with quotas and policies
- [x] `build-image` action builds ARM64 image and pushes to GHCR
- [x] `deploy-app` action deploys using generic Helm chart
- [x] `pr-comment` action creates/updates PR comment with preview URL
- [x] `destroy-namespace` action safely deletes namespace
- [x] All actions are self-contained (no external file dependencies)
- [x] K8s templates embedded in actions (not fetched from files)

## Priority

**Must** - Required for simplified onboarding

## Story Points

13

## Dependencies

- US-028: Publish Helm Charts to OCI Registry
- US-029: Create Generic Application Chart

## Notes

- Actions must work without checking out the platform repo
- Templates (namespace, quotas, network policies) embedded in action code
- Each action has clear inputs/outputs for workflow orchestration
- Error handling with meaningful messages for debugging

## Implementation

Created 7 reusable composite GitHub Actions:

### Actions Created

| Action | Description | Key Features |
|--------|-------------|--------------|
| `setup-tools` | Install kubectl and helm with caching | SHA256 verification, arm64/amd64 support |
| `validate-config` | Parse and validate k8s-ee.yaml | JSON schema validation, yq/ajv-cli |
| `create-namespace` | Create namespace with policies | 8 embedded K8s templates, ownership verification |
| `build-image` | Build ARM64 image with security scans | QEMU/Buildx, Trivy scan, SBOM generation |
| `deploy-app` | Deploy via Helm OCI chart | Atomic deployments, health check |
| `pr-comment` | Create/update PR comments | Idempotent, status-based messages |
| `destroy-namespace` | Safely delete namespaces | Ownership verification, preserve label check |

### Directory Structure

```
.github/actions/
├── setup-tools/action.yml
├── validate-config/
│   ├── action.yml
│   └── schema.json
├── create-namespace/action.yml
├── build-image/action.yml
├── deploy-app/action.yml
├── pr-comment/action.yml
└── destroy-namespace/action.yml
```

### Key Design Decisions

1. **Self-contained**: All K8s templates embedded as heredocs in create-namespace action
2. **Security**: Input validation, SHA256 verification, no `eval` usage
3. **Idempotent**: All actions safe to run multiple times
4. **Pinned dependencies**: All external actions pinned to SHA hashes
