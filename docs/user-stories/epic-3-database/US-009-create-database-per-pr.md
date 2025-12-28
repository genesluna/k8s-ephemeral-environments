# US-009: Create Isolated Database per PR

## User Story

**As a** developer,
**I want** an isolated PostgreSQL database for my PR environment,
**So that** my tests don't affect other PRs and I have a clean database state.

## Acceptance Criteria

- [ ] PostgreSQL instance created per PR namespace
- [ ] Database initialized with schema/migrations
- [ ] Connection string available to application
- [ ] Database isolated from other PR databases
- [ ] Database provisioning completes in < 3 minutes

## Priority

**Must** - Critical for MVP

## Story Points

8

## Dependencies

- US-004: Create Namespace on PR Open

## Notes

- Options: CloudNativePG operator, PostgreSQL container with emptyDir, or external DB with schema per PR
- For MVP, simple PostgreSQL container may be sufficient
- Consider seeding with test data
