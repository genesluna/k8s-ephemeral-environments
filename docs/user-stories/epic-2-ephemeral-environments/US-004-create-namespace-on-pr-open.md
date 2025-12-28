# US-004: Create Namespace on PR Open

## User Story

**As a** developer,
**I want** a Kubernetes namespace to be created automatically when I open a PR,
**So that** my changes are deployed to an isolated environment.

## Acceptance Criteria

- [ ] GitHub Actions workflow triggers on `pull_request: opened` event
- [ ] Namespace created with naming convention: `<app>-pr-<number>`
- [ ] Namespace has standard labels (pr-number, branch, commit-sha)
- [ ] ResourceQuota and LimitRange applied to namespace
- [ ] Workflow completes in < 2 minutes

## Priority

**Must** - Critical for MVP

## Story Points

5

## Dependencies

- US-002: Install and Configure k3s Cluster
- US-008: Configure GitHub Actions Access to Cluster

## Notes

- Namespace should be idempotent (re-running doesn't fail)
- Consider using Helm or Kustomize for namespace setup
