# US-020: Implement Cleanup Job for Orphaned Resources

**Status:** Done

## User Story

**As an** SRE/DevOps engineer,
**I want** a periodic job that cleans up orphaned resources,
**So that** the cluster doesn't accumulate stale namespaces and resources.

## Acceptance Criteria

- [x] CronJob runs periodically (e.g., every 6 hours)
- [x] Identifies namespaces where PR is closed
- [x] Deletes orphaned namespaces older than 24 hours
- [x] Logs all cleanup actions
- [x] Alerts if cleanup fails

## Priority

**Should** - Important but not blocking

## Story Points

5

## Dependencies

- US-008: Destroy Environment on PR Close/Merge

## Implementation

Implemented as a Kubernetes CronJob that runs every 6 hours:

| Resource | File |
|----------|------|
| Namespace | `k8s/platform/namespace.yaml` |
| RBAC | `k8s/platform/cleanup-job/cleanup-rbac.yaml` |
| CronJob | `k8s/platform/cleanup-job/cleanup-cronjob.yaml` |
| ConfigMap | `k8s/platform/cleanup-job/cleanup-configmap.yaml` |
| Alerts | `k8s/platform/alerts/cleanup-alerts.yaml` |
| Script | `scripts/cleanup-orphaned-namespaces.py` |

### Safety Checks

The cleanup job includes multiple safety mechanisms:

1. **Label verification**: Only targets namespaces with `k8s-ee/type=ephemeral`
2. **Ownership check**: Verifies `app.kubernetes.io/managed-by=github-actions`
3. **Age threshold**: Skips namespaces younger than 24 hours
4. **Preserve label**: Respects `preserve=true` for US-021 compatibility
5. **GitHub API verification**: Confirms PR is actually closed before deletion
6. **Dry-run mode**: Available for testing without actual deletion

### Alerts

PrometheusRule alerts configured:
- `CleanupJobFailed` (warning): Job failed
- `CleanupJobConsecutiveFailures` (critical): 2+ failures in 24h
- `CleanupJobNotRunning` (warning): Not run in 8+ hours
- `TooManyEphemeralNamespaces` (warning): >10 ephemeral namespaces
- `OldEphemeralNamespace` (warning): Namespace >72 hours old

## Notes

- Safety net for when webhook-based cleanup fails
- Uses GitHub API to check PR status
- Dry-run mode available for testing
- Runbook: `docs/runbooks/cleanup-job.md`
