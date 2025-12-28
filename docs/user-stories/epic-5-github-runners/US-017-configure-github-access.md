# US-017: Configure GitHub Actions Access to Cluster

## User Story

**As an** SRE/DevOps engineer,
**I want** GitHub Actions workflows to have secure access to the Kubernetes cluster,
**So that** CI/CD pipelines can deploy applications.

## Acceptance Criteria

- [ ] kubeconfig stored as GitHub Secret
- [ ] ServiceAccount with appropriate permissions created
- [ ] Workflows can execute kubectl commands
- [ ] Access scoped to necessary permissions only
- [ ] Credentials rotatable without workflow changes

## Priority

**Must** - Critical for MVP

## Story Points

3

## Dependencies

- US-002: Install and Configure k3s Cluster

## Notes

- Use short-lived tokens when possible
- Consider OIDC for GitHub Actions (if supported by k3s)
- ServiceAccount should have least-privilege permissions
