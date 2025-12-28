# Tasks for US-012: Deploy Loki for Log Aggregation

## Tasks

### T-012.1: Install Loki
- **Description:** Deploy Loki using Helm chart
- **Acceptance Criteria:**
  - Loki deployed in observability namespace
  - Storage configured (filesystem or object storage)
  - Service accessible within cluster
- **Estimate:** M

### T-012.2: Install Promtail
- **Description:** Deploy Promtail as log collector
- **Acceptance Criteria:**
  - Promtail DaemonSet running on all nodes
  - Configured to send logs to Loki
  - Labels extracted (namespace, pod, container)
- **Estimate:** M

### T-012.3: Configure Log Retention
- **Description:** Set up log retention policy
- **Acceptance Criteria:**
  - Retention set to 7 days
  - Storage limits configured
  - Old logs automatically deleted
- **Estimate:** S

### T-012.4: Test Log Queries
- **Description:** Verify logs are queryable
- **Acceptance Criteria:**
  - Query by namespace works
  - Query by pod name works
  - Query by container works
  - Full-text search works
- **Estimate:** S

### T-012.5: Configure Resource Limits
- **Description:** Set resource limits for Loki stack
- **Acceptance Criteria:**
  - Loki memory < 1.5GB
  - Promtail memory < 256MB per node
  - Stack stable under load
- **Estimate:** S

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
