# US-014: Configure Basic Alerts

## User Story

**As an** SRE/DevOps engineer,
**I want** basic alerts configured for cluster health,
**So that** I'm notified of problems before they impact users.

## Acceptance Criteria

- [ ] Alert for disk usage > 80%
- [ ] Alert for memory usage > 90%
- [ ] Alert for pod crash loops (> 3 restarts in 10 min)
- [ ] Alert for node not ready
- [ ] Alerts visible in Grafana
- [ ] Optional: notifications via Slack/email

## Priority

**Could** - Nice to have

## Story Points

3

## Dependencies

- US-011: Deploy Prometheus for Metrics Collection
- US-013: Deploy Grafana Dashboards

## Notes

- Start with critical alerts only
- Use Prometheus Alertmanager for routing
- Consider Grafana alerting as alternative
