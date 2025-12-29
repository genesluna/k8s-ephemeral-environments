# US-005: Deploy Application to PR Environment

**Status:** Done

## User Story

**As a** developer,
**I want** my application deployed automatically to the PR namespace,
**So that** I can test my changes in a running environment.

## Acceptance Criteria

- [x] Application image built with commit SHA tag
- [x] Application deployed to PR namespace
- [x] ConfigMaps and Secrets created for the environment
- [x] Service created to expose the application
- [x] Health checks pass before marking deploy complete
- [x] Total deploy time < 10 minutes (including build)

## Priority

**Must** - Critical for MVP

## Story Points

8

## Dependencies

- US-004: Create Namespace on PR Open
- US-009: Create Isolated Database per PR

## Notes

- Use Helm chart or Kustomize for deployment
- Consider using GitHub Container Registry for images
- Deployment should be idempotent for re-deploys on new commits
