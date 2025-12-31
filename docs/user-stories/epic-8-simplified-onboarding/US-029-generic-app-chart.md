# US-029: Create Generic Application Chart

**Status:** Draft

## User Story

**As a** platform user,
**I want** a generic Helm chart that works for any application,
**So that** I don't need to create or customize Helm charts for my app.

## Acceptance Criteria

- [ ] Generic `k8s-ee-app` chart created with configurable values
- [ ] Chart dependencies reference OCI registry (not `file://`)
- [ ] Deployment template supports configurable port and health endpoints
- [ ] Ingress template generates correct preview URLs
- [ ] ServiceMonitor template for Prometheus metrics (optional)
- [ ] Environment variable injection from config
- [ ] Init containers for database readiness (conditional)
- [ ] Chart published to GHCR alongside database charts

## Priority

**Must** - Required for simplified onboarding

## Story Points

8

## Dependencies

- US-028: Publish Helm Charts to OCI Registry

## Notes

- Chart should be completely generic - no app-specific code
- All customization via values.yaml populated from k8s-ee.yaml config
- Database subcharts conditionally included based on config
- Security context follows existing hardened patterns

## Implementation

_To be documented upon completion._
