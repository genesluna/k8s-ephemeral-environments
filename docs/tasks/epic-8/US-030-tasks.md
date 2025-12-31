# Tasks for US-030: Create Reusable Composite Actions

**Status:** Done

## Tasks

### T-030.1: Create validate-config Action ✅
- **Description:** Create action to parse and validate k8s-ee.yaml
- **Acceptance Criteria:**
  - Checks out calling repository
  - Parses k8s-ee.yaml from configurable path
  - Validates against JSON schema
  - Outputs config as JSON for other jobs
  - Outputs projectId and namespace
  - Clear error messages on validation failure
- **Estimate:** M
- **Files:** `.github/actions/validate-config/action.yml`, `.github/actions/validate-config/schema.json`
- **Status:** Done

### T-030.2: Create setup-tools Action ✅
- **Description:** Create action to install kubectl and helm with caching
- **Acceptance Criteria:**
  - Installs kubectl with version parameter
  - Installs helm with version parameter
  - Caches binaries across runs
  - Verifies installation
- **Estimate:** S
- **Files:** `.github/actions/setup-tools/action.yml`
- **Status:** Done

### T-030.3: Create create-namespace Action ✅
- **Description:** Create action to create namespace with policies
- **Acceptance Criteria:**
  - Creates namespace with labels and annotations
  - Applies ResourceQuota (embedded template)
  - Applies LimitRange (embedded template)
  - Applies NetworkPolicies (embedded templates)
  - Verifies ownership before updates
  - Idempotent (safe to run multiple times)
- **Estimate:** L
- **Files:** `.github/actions/create-namespace/action.yml`
- **Status:** Done

### T-030.4: Create build-image Action ✅
- **Description:** Create action to build and push container image
- **Acceptance Criteria:**
  - Sets up QEMU and Buildx
  - Logs into GHCR
  - Builds ARM64 image from configurable context/dockerfile
  - Pushes to GHCR with PR tag
  - Runs Trivy vulnerability scan
  - Generates SBOM
  - Outputs image tag and digest
- **Estimate:** M
- **Files:** `.github/actions/build-image/action.yml`
- **Status:** Done

### T-030.5: Create deploy-app Action ✅
- **Description:** Create action to deploy application with Helm
- **Acceptance Criteria:**
  - Pulls k8s-ee-app chart from OCI registry
  - Generates values from config JSON input
  - Runs `helm upgrade --install --atomic`
  - Waits for deployment rollout
  - Performs health check
  - Outputs preview URL
- **Estimate:** M
- **Files:** `.github/actions/deploy-app/action.yml`
- **Status:** Done

### T-030.6: Create pr-comment Action ✅
- **Description:** Create action to post PR comment with preview URL
- **Acceptance Criteria:**
  - Creates or updates PR comment (idempotent)
  - Uses unique marker for finding existing comment
  - Supports success and failure states
  - Includes preview URL, namespace, commit info
  - Works with github-script
- **Estimate:** S
- **Files:** `.github/actions/pr-comment/action.yml`
- **Status:** Done

### T-030.7: Create destroy-namespace Action ✅
- **Description:** Create action to safely delete namespace
- **Acceptance Criteria:**
  - Verifies ownership before deletion
  - Checks preserve label (skips if preserved)
  - Removes finalizers from stuck resources
  - Handles deletion timeout gracefully
  - Updates PR comment on completion
- **Estimate:** S
- **Files:** `.github/actions/destroy-namespace/action.yml`
- **Status:** Done

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
