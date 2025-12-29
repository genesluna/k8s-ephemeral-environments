# US-012: Deploy Loki for Log Aggregation

**Status:** Done

## User Story

**As a** developer,
**I want** logs from my PR environment collected and searchable,
**So that** I can debug issues without accessing the cluster directly.

## Acceptance Criteria

- [x] Loki deployed in `observability` namespace
- [x] Promtail collecting logs from all pods
- [x] Logs queryable by namespace/pod/container
- [x] Retention configured (7 days)
- [x] Resource usage < 2GB RAM

## Priority

**Must** - Critical for MVP

## Story Points

5

## Dependencies

- US-002: Install and Configure k3s Cluster
- US-011: Deploy Prometheus for Metrics Collection

## Notes

- Use Loki-stack Helm chart or Grafana's official charts
- Promtail runs as DaemonSet to collect logs from all nodes
- Consider log volume and adjust retention accordingly
