# US-030: Create Reusable Composite Actions

**Status:** Draft

## User Story

**As a** platform maintainer,
**I want** reusable composite actions for each deployment step,
**So that** the workflow logic is modular and easy to maintain.

## Acceptance Criteria

- [ ] `validate-config` action parses and validates k8s-ee.yaml
- [ ] `setup-tools` action installs kubectl and helm with caching
- [ ] `create-namespace` action creates namespace with quotas and policies
- [ ] `build-image` action builds ARM64 image and pushes to GHCR
- [ ] `deploy-app` action deploys using generic Helm chart
- [ ] `pr-comment` action creates/updates PR comment with preview URL
- [ ] `destroy-namespace` action safely deletes namespace
- [ ] All actions are self-contained (no external file dependencies)
- [ ] K8s templates embedded in actions (not fetched from files)

## Priority

**Must** - Required for simplified onboarding

## Story Points

13

## Dependencies

- US-028: Publish Helm Charts to OCI Registry
- US-029: Create Generic Application Chart

## Notes

- Actions must work without checking out the platform repo
- Templates (namespace, quotas, network policies) embedded in action code
- Each action has clear inputs/outputs for workflow orchestration
- Error handling with meaningful messages for debugging

## Implementation

_To be documented upon completion._
