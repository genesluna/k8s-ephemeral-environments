# Tasks for US-019: Configure Network Policies

## Tasks

### T-019.1: Enable Network Policy Support
- **Description:** Verify k3s supports NetworkPolicies
- **Acceptance Criteria:**
  - NetworkPolicy controller running
  - Test policy can be applied
  - Policy takes effect
- **Estimate:** S

### T-019.2: Create Default Deny Policy
- **Description:** Create policy to deny cross-namespace traffic
- **Acceptance Criteria:**
  - Ingress from other PR namespaces denied
  - Policy template created
  - Applied to all PR namespaces
- **Estimate:** S

### T-019.3: Create Allow Same-Namespace Policy
- **Description:** Allow traffic within namespace
- **Acceptance Criteria:**
  - Pods in same namespace can communicate
  - App can reach database
  - Service discovery works
- **Estimate:** S

### T-019.4: Create Ingress Allow Policy
- **Description:** Allow traffic from ingress controller
- **Acceptance Criteria:**
  - Traffic from Traefik namespace allowed
  - External HTTP requests work
  - Only ingress traffic allowed
- **Estimate:** S

### T-019.5: Create Observability Allow Policy
- **Description:** Allow traffic to/from observability
- **Acceptance Criteria:**
  - Prometheus can scrape metrics
  - Promtail can collect logs
  - Grafana accessible
- **Estimate:** S

### T-019.6: Configure Egress Policies
- **Description:** Allow required egress traffic
- **Acceptance Criteria:**
  - DNS resolution works (port 53)
  - External API calls work
  - Container registry accessible
- **Estimate:** S

### T-019.7: Test Network Isolation
- **Description:** Verify isolation is working
- **Acceptance Criteria:**
  - Pod in PR-1 cannot ping pod in PR-2
  - Pod in PR-1 can reach own database
  - External traffic works
  - Ingress works
- **Estimate:** M

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
