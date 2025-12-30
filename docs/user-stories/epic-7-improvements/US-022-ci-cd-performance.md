# US-022: CI/CD Pipeline Performance

**Status:** Draft

## User Story

**As a** developer,
**I want** faster CI/CD pipelines,
**So that** I get quicker feedback on my PRs.

## Acceptance Criteria

- [ ] kubectl installation reused via composite action
- [ ] Binary caching reduces pipeline time by 30+ seconds
- [ ] pnpm dependencies cached between builds
- [ ] Helm dependencies cached
- [ ] Pipeline metrics tracked for performance monitoring

## Priority

**Should** - Important but not blocking

## Story Points

5

## Dependencies

- None (standalone improvement)

## Notes

- Current pipeline takes ~8-10 minutes
- Target: < 6 minutes
- kubectl installation is duplicated 3 times in workflow (63 lines)
- Binary caching can save ~30s per job
- pnpm caching can save ~60s on builds

## Implementation

- **Composite Action:** `.github/actions/install-kubectl/action.yml`
- **Workflow Updates:** `.github/workflows/pr-environment.yml`
  - Add actions/cache for kubectl and helm binaries
  - Add pnpm/action with caching enabled
  - Add Helm dependency caching
  - Add workflow duration metrics
