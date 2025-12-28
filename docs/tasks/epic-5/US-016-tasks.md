# Tasks for US-016: Configure Runner Deployment

## Tasks

### T-016.1: Create RunnerDeployment Manifest
- **Description:** Define RunnerDeployment for repository
- **Acceptance Criteria:**
  - RunnerDeployment YAML created
  - Targets correct repository/organization
  - Labels configured for workflow selection
  - Replica count set (min 1)
- **Estimate:** S

### T-016.2: Configure Runner Tools
- **Description:** Ensure runners have required tools
- **Acceptance Criteria:**
  - kubectl available in runner
  - helm available in runner
  - docker available (if needed)
  - Common dev tools available
- **Estimate:** M

### T-016.3: Create ServiceAccount for Runners
- **Description:** Set up RBAC for runner cluster access
- **Acceptance Criteria:**
  - ServiceAccount created
  - ClusterRole/Role with required permissions
  - RoleBinding applied
  - Runners can create/delete namespaces
- **Estimate:** S

### T-016.4: Configure Ephemeral Runners
- **Description:** Set up runners to be ephemeral
- **Acceptance Criteria:**
  - Runner configured as ephemeral
  - New pod created for each job
  - Pod terminated after job completes
  - Clean environment guaranteed
- **Estimate:** S

### T-016.5: Configure Runner Scaling
- **Description:** Set up autoscaling for runners
- **Acceptance Criteria:**
  - Minimum replicas: 1
  - Maximum replicas: 3
  - Scale based on job queue
  - Scale down when idle
- **Estimate:** M

### T-016.6: Test Runner Execution
- **Description:** Verify runners execute jobs correctly
- **Acceptance Criteria:**
  - Create test workflow targeting self-hosted runner
  - Job executes successfully
  - kubectl commands work
  - Logs visible in GitHub Actions
- **Estimate:** S

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
