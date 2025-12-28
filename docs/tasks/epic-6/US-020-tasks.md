# Tasks for US-020: Implement Cleanup Job for Orphaned Resources

## Tasks

### T-020.1: Create Cleanup Script
- **Description:** Write script to identify and clean orphaned namespaces
- **Acceptance Criteria:**
  - Lists PR namespaces
  - Queries GitHub API for PR status
  - Identifies closed PRs with existing namespaces
  - Deletes orphaned namespaces
  - Logs all actions
- **Estimate:** M

### T-020.2: Create CronJob Manifest
- **Description:** Define Kubernetes CronJob for cleanup
- **Acceptance Criteria:**
  - CronJob runs every 6 hours
  - Uses cleanup script
  - Has appropriate RBAC permissions
  - Timeout configured
- **Estimate:** S

### T-020.3: Configure GitHub API Access
- **Description:** Set up authentication for GitHub API
- **Acceptance Criteria:**
  - PAT or GitHub App token available
  - Token stored as Secret
  - Can query PR status
- **Estimate:** S

### T-020.4: Add Safety Checks
- **Description:** Implement safeguards against accidental deletion
- **Acceptance Criteria:**
  - Only deletes namespaces matching PR pattern
  - Skips namespaces with "preserve" label
  - Requires PR to be closed for > 1 hour
  - Dry-run mode available
- **Estimate:** S

### T-020.5: Add Cleanup Monitoring
- **Description:** Monitor cleanup job execution
- **Acceptance Criteria:**
  - Job success/failure logged
  - Metrics for namespaces cleaned
  - Alert on repeated failures
- **Estimate:** S

### T-020.6: Test Cleanup Job
- **Description:** Verify cleanup works correctly
- **Acceptance Criteria:**
  - Create orphaned namespace manually
  - Job identifies and deletes it
  - Protected namespaces not affected
  - Logs accurate
- **Estimate:** S

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
