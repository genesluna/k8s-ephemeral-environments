# US-028: Publish Helm Charts to OCI Registry

**Status:** Draft

## User Story

**As a** platform user,
**I want** Helm charts published to an OCI registry,
**So that** I can pull them without copying chart files to my repository.

## Acceptance Criteria

- [ ] PostgreSQL chart renamed to `k8s-ee-postgresql` and published to GHCR
- [ ] MongoDB chart renamed to `k8s-ee-mongodb` and published to GHCR
- [ ] Redis chart renamed to `k8s-ee-redis` and published to GHCR
- [ ] MinIO chart renamed to `k8s-ee-minio` and published to GHCR
- [ ] GitHub workflow automatically publishes charts on push to main
- [ ] Charts accessible via `oci://ghcr.io/genesluna/k8s-ephemeral-environments/charts/`

## Priority

**Must** - Required for simplified onboarding

## Story Points

5

## Dependencies

- None (foundational for other stories)

## Notes

- Current charts use `file://` references requiring local copies
- OCI registry support added in Helm 3.8+
- Charts will be versioned using semantic versioning
- Publishing workflow triggers on changes to `charts/` directory

## Implementation

_To be documented upon completion._
