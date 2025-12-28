# US-020: Implement Cleanup Job for Orphaned Resources

## User Story

**As an** SRE/DevOps engineer,
**I want** a periodic job that cleans up orphaned resources,
**So that** the cluster doesn't accumulate stale namespaces and resources.

## Acceptance Criteria

- [ ] CronJob runs periodically (e.g., every 6 hours)
- [ ] Identifies namespaces where PR is closed
- [ ] Deletes orphaned namespaces older than 24 hours
- [ ] Logs all cleanup actions
- [ ] Alerts if cleanup fails

## Priority

**Should** - Important but not blocking

## Story Points

5

## Dependencies

- US-008: Destroy Environment on PR Close/Merge

## Notes

- Safety net for when webhook-based cleanup fails
- Use GitHub API to check PR status
- Consider dry-run mode for testing
