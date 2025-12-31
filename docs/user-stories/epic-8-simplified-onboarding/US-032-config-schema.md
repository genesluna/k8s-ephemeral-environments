# US-032: Define Configuration Schema

**Status:** Draft

## User Story

**As a** platform user,
**I want** a simple configuration file with sensible defaults,
**So that** I can get started with minimal configuration.

## Acceptance Criteria

- [ ] JSON Schema defined for k8s-ee.yaml validation
- [ ] `projectId` required (max 20 chars, lowercase alphanumeric + hyphens)
- [ ] `app.port` has default (3000)
- [ ] `app.healthPath` has default (/api/health)
- [ ] `image.context` and `image.dockerfile` have defaults
- [ ] `resources` have sensible defaults within cluster limits
- [ ] `databases` all default to false (opt-in)
- [ ] Validation errors provide clear, actionable messages
- [ ] Schema documented in config reference guide

## Priority

**Must** - Required for simplified onboarding

## Story Points

5

## Dependencies

- None (can be done in parallel)

## Notes

- Minimal required config: just `projectId` and `app.port`
- Extended config for power users (custom resources, env vars, etc.)
- Schema validation runs early in workflow to fail fast
- Config reference guide with examples for common scenarios

## Implementation

_To be documented upon completion._
