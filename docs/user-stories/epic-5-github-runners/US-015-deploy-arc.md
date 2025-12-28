# US-015: Deploy Actions Runner Controller (ARC)

## User Story

**As an** SRE/DevOps engineer,
**I want** GitHub Actions runners running inside the Kubernetes cluster,
**So that** CI/CD jobs have direct access to the cluster and run faster.

## Acceptance Criteria

- [ ] ARC (Actions Runner Controller) deployed in `gh-runners` namespace
- [ ] Controller registered with GitHub organization/repository
- [ ] Runner pods can be scheduled on the cluster
- [ ] Runners appear in GitHub Actions settings
- [ ] Controller survives cluster restarts

## Priority

**Should** - Important but not blocking

## Story Points

5

## Dependencies

- US-002: Install and Configure k3s Cluster

## Notes

- Use actions-runner-controller (ARC) from GitHub
- Requires GitHub App or PAT for authentication
- Consider using ephemeral runners (one job per pod)
