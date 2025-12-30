# US-026: Observability Enhancements

**Status:** Done

## User Story

**As a** developer,
**I want** application-level metrics and dashboards,
**So that** I can monitor PR environment health.

## Acceptance Criteria

- [x] Demo-app exports Prometheus metrics
- [x] Structured logging with correlation IDs
- [x] ServiceMonitor auto-scrapes app metrics
- [x] Grafana dashboards for PR environments
- [x] Additional alerts for databases, quotas, SLOs
- [x] Comprehensive alert coverage

## Priority

**Should** - Important but not blocking

## Story Points

8

## Dependencies

- US-011: Deploy Prometheus (completed)
- US-013: Deploy Grafana (completed)
- US-014: Configure Basic Alerts (completed)

## Notes

- Demo-app doesn't export Prometheus metrics
- Uses console.log instead of structured logging
- No pre-built Grafana dashboards for PR environments
- Current alerts: 6 (disk, memory, pod crash, node ready)
- Missing alerts: database connectivity, quota limits, API latency

## Implementation

- **Demo App Metrics:**
  - Add `prom-client` to `demo-app/apps/api/package.json`
  - Add metrics middleware to `demo-app/apps/api/src/main.ts`
  - Export: request duration, error rates, DB connection pool

- **Structured Logging:**
  - Add Pino logger to demo-app
  - Add correlation ID middleware
  - Configure JSON output format

- **ServiceMonitor:**
  - Create `charts/demo-app/templates/servicemonitor.yaml`
  - Configure auto-scraping of app metrics

- **Grafana Dashboards:**
  - Create `k8s/observability/dashboards/pr-environment-overview.json`
  - Create `k8s/observability/dashboards/application-metrics.json`

- **Alerts:**
  - Add 8-10 new alerts to `k8s/observability/custom-alerts.yaml`
  - Include: database health, quota limits, API SLOs
