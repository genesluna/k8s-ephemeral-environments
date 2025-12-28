# US-008: Destroy Environment on PR Close/Merge

## User Story

**As an** SRE/DevOps engineer,
**I want** PR environments destroyed automatically when PRs are closed or merged,
**So that** cluster resources are freed and costs are controlled.

## Acceptance Criteria

- [ ] GitHub Actions workflow triggers on `pull_request: closed` event
- [ ] Namespace and all resources deleted
- [ ] Persistent volumes (PVCs) deleted
- [ ] Cleanup completes in < 5 minutes
- [ ] No orphaned resources remain
- [ ] PR comment updated to indicate environment destroyed

## Priority

**Must** - Critical for MVP

## Story Points

5

## Dependencies

- US-004: Create Namespace on PR Open

## Notes

- Use `kubectl delete namespace` with `--wait` flag
- Consider adding a finalizer job to ensure cleanup
- Log cleanup actions for audit trail
