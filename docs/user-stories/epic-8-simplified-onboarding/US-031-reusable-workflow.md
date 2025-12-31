# US-031: Create Reusable Workflow

**Status:** Draft

## User Story

**As a** platform user,
**I want** a reusable workflow I can call from my repository,
**So that** I only need a minimal boilerplate workflow file.

## Acceptance Criteria

- [ ] Reusable workflow created with `workflow_call` trigger
- [ ] Workflow accepts PR metadata as inputs (number, action, sha, ref, repo)
- [ ] Config file path is configurable (defaults to `k8s-ee.yaml`)
- [ ] Workflow orchestrates all composite actions in correct order
- [ ] Jobs run conditionally based on PR action (deploy vs destroy)
- [ ] Secrets passed via `secrets: inherit`
- [ ] Concurrency control prevents race conditions
- [ ] Client workflow file is ~10 lines of copy-paste boilerplate

## Priority

**Must** - Required for simplified onboarding

## Story Points

8

## Dependencies

- US-030: Create Reusable Composite Actions

## Notes

- Client repos call workflow via `uses: genesluna/k8s-ephemeral-environments/.github/workflows/pr-environment-reusable.yml@v1`
- Version pinning supported (@v1, @main, @sha)
- Job outputs passed between jobs for orchestration
- Health checks run after deployment

## Implementation

_To be documented upon completion._
