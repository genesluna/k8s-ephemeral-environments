# Tasks for US-031: Create Reusable Workflow

**Status:** Draft

## Tasks

### T-031.1: Create Workflow Structure
- **Description:** Create reusable workflow with workflow_call trigger
- **Acceptance Criteria:**
  - `on: workflow_call` trigger configured
  - Inputs defined for PR metadata
  - Config path input with default
  - Concurrency group prevents race conditions
  - Environment variables for cluster config
- **Estimate:** S
- **Files:** `.github/workflows/pr-environment-reusable.yml`

### T-031.2: Create validate-config Job
- **Description:** Create job to parse and validate configuration
- **Acceptance Criteria:**
  - Runs on ubuntu-latest (lightweight)
  - Calls validate-config action
  - Outputs config JSON for downstream jobs
  - Outputs namespace and project-id
- **Estimate:** S
- **Files:** `.github/workflows/pr-environment-reusable.yml`

### T-031.3: Create create-namespace Job
- **Description:** Create job to set up PR namespace
- **Acceptance Criteria:**
  - Runs on arc-runner-set (in-cluster)
  - Conditional on PR not closed
  - Depends on validate-config
  - Calls create-namespace action
- **Estimate:** S
- **Files:** `.github/workflows/pr-environment-reusable.yml`

### T-031.4: Create build-image Job
- **Description:** Create job to build and push container image
- **Acceptance Criteria:**
  - Runs on ubuntu-latest (for GHCR access)
  - Conditional on PR not closed
  - Depends on validate-config and create-namespace
  - Calls build-image action
  - Outputs image tag and digest
- **Estimate:** S
- **Files:** `.github/workflows/pr-environment-reusable.yml`

### T-031.5: Create deploy Job
- **Description:** Create job to deploy application
- **Acceptance Criteria:**
  - Runs on arc-runner-set (in-cluster)
  - Conditional on PR not closed
  - Depends on all previous jobs
  - Calls deploy-app action
  - Calls pr-comment action on success/failure
- **Estimate:** M
- **Files:** `.github/workflows/pr-environment-reusable.yml`

### T-031.6: Create destroy Job
- **Description:** Create job to destroy namespace on PR close
- **Acceptance Criteria:**
  - Runs on arc-runner-set (in-cluster)
  - Conditional on PR closed
  - Depends on validate-config only
  - Calls destroy-namespace action
  - Updates PR comment
- **Estimate:** S
- **Files:** `.github/workflows/pr-environment-reusable.yml`

### T-031.7: Create Client Workflow Template
- **Description:** Create minimal boilerplate workflow for client repos
- **Acceptance Criteria:**
  - ~10 lines of YAML
  - Triggers on PR events
  - Calls reusable workflow with inputs
  - Uses `secrets: inherit`
  - Documented in onboarding guide
- **Estimate:** XS
- **Files:** Documentation only

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
