# US-016: Configure Runner Deployment

## User Story

**As a** developer,
**I want** GitHub Actions to run on self-hosted runners in the cluster,
**So that** my CI/CD jobs have kubectl access and run faster.

## Acceptance Criteria

- [ ] RunnerDeployment created for target repository
- [ ] Runners have kubectl, helm, docker installed
- [ ] Runners can execute jobs from GitHub Actions
- [ ] Runner pods scale based on job queue (min 1, max 3)
- [ ] Ephemeral runners (one job per pod)

## Priority

**Should** - Important but not blocking

## Story Points

5

## Dependencies

- US-015: Deploy Actions Runner Controller (ARC)

## Notes

- Use ephemeral runners for clean environment per job
- Pre-install common tools in runner image
- Consider building custom runner image
