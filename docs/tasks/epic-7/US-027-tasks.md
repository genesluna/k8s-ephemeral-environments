# Tasks for US-027: Kubernetes Best Practices

**Status:** Draft

## Tasks

### T-027.1: Create PriorityClasses
- **Description:** Define priority classes for workload scheduling
- **Acceptance Criteria:**
  - `system-platform` class (value: 1000000) for platform components
  - `default-app` class (value: 100) for PR environments
  - Applied to cleanup jobs and operators
  - Documented in cluster operations runbook
- **Estimate:** S
- **Files:** `k8s/platform/priority-classes.yaml`

### T-027.2: Add Pod Disruption Budgets
- **Description:** Protect system components during maintenance
- **Acceptance Criteria:**
  - PDB for cleanup job
  - PDB for preserve expiry job
  - PDB for observability stack components
  - Minimum availability defined
- **Estimate:** S
- **Files:** `k8s/platform/pod-disruption-budgets.yaml`

### T-027.3: Add Startup Probes to Databases
- **Description:** Handle slow database initialization
- **Acceptance Criteria:**
  - Startup probe added to MongoDB chart
  - Startup probe added to MinIO chart
  - Initial delay and period configured appropriately
  - Prevents premature liveness probe failures
- **Estimate:** S
- **Files:**
  - `charts/mongodb/templates/mongodb.yaml`
  - `charts/mongodb/values.yaml`
  - `charts/minio/templates/tenant.yaml`
  - `charts/minio/values.yaml`

### T-027.4: Add Lifecycle Hooks
- **Description:** Enable graceful shutdown for applications
- **Acceptance Criteria:**
  - preStop hook added to demo-app deployment
  - terminationGracePeriodSeconds configured
  - Graceful connection draining enabled
  - Tested with rolling updates
- **Estimate:** S
- **Files:**
  - `charts/demo-app/templates/deployment.yaml`
  - `charts/demo-app/values.yaml`

### T-027.5: Improve Helm Chart Metadata
- **Description:** Follow Helm best practices for Chart.yaml
- **Acceptance Criteria:**
  - kubeVersion specified in all charts
  - keywords added for discoverability
  - home URL set to repository
  - maintainers section populated
  - annotations for category
- **Estimate:** S
- **Files:**
  - `charts/demo-app/Chart.yaml`
  - `charts/postgresql/Chart.yaml`
  - `charts/mongodb/Chart.yaml`
  - `charts/minio/Chart.yaml`
  - `charts/redis/Chart.yaml`

### T-027.6: Abstract Cluster-Specific Configs
- **Description:** Prepare configurations for Phase 2 EKS migration
- **Acceptance Criteria:**
  - Hardcoded K8s API IP replaced with configurable value
  - NetworkPolicy documented for EKS differences
  - Migration notes added to documentation
  - Tested that current k3s still works
- **Estimate:** M
- **Files:**
  - `k8s/ephemeral/network-policy-allow-egress.yaml`
  - `docs/guides/phase2-migration.md`

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
