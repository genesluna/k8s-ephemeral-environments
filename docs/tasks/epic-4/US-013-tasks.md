# Tasks for US-013: Deploy Grafana Dashboards

## Tasks

### T-013.1: Configure Grafana in Prometheus Stack
- **Description:** Enable and configure Grafana in kube-prometheus-stack
- **Acceptance Criteria:**
  - Grafana enabled in values
  - Admin credentials configured
  - Persistence enabled
- **Estimate:** S

### T-013.2: Add Loki Data Source
- **Description:** Configure Loki as Grafana data source
- **Acceptance Criteria:**
  - Loki data source added
  - Connection tested successfully
  - Logs visible in Explore view
- **Estimate:** S

### T-013.3: Create Cluster Overview Dashboard
- **Description:** Build or import cluster-wide dashboard
- **Acceptance Criteria:**
  - Dashboard shows node metrics
  - Dashboard shows pod counts
  - Dashboard shows resource usage
  - Dashboard provisioned via ConfigMap
- **Estimate:** M

### T-013.4: Create Namespace Dashboard
- **Description:** Build dashboard for per-namespace view
- **Acceptance Criteria:**
  - Filterable by namespace
  - Shows namespace-specific pods
  - Shows namespace resource usage
  - Shows namespace logs
- **Estimate:** M

### T-013.5: Configure Grafana Ingress
- **Description:** Expose Grafana via public URL
- **Acceptance Criteria:**
  - Ingress created for Grafana
  - TLS configured
  - URL: grafana.preview.domain.com
  - Authentication working
- **Estimate:** S

### T-013.6: Configure Authentication
- **Description:** Set up Grafana authentication
- **Acceptance Criteria:**
  - Admin password set securely
  - Basic auth or GitHub OAuth configured
  - Anonymous access disabled
- **Estimate:** S

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
