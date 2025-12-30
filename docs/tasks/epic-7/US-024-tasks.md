# Tasks for US-024: Security Hardening

**Status:** Draft

## Tasks

### T-024.1: Add Trivy Image Scanning
- **Description:** Scan container images for CVEs before deployment
- **Acceptance Criteria:**
  - Trivy action added after docker build
  - Scan runs on every PR
  - Critical/High CVEs fail the build
  - Scan results uploaded as artifact
- **Estimate:** S
- **Files:** `.github/workflows/pr-environment.yml`

### T-024.2: Generate SBOM
- **Description:** Generate Software Bill of Materials for supply chain transparency
- **Acceptance Criteria:**
  - SBOM generated with anchore/sbom-action
  - SBOM attached to container image
  - SBOM uploaded as workflow artifact
- **Estimate:** S
- **Files:** `.github/workflows/pr-environment.yml`

### T-024.3: Pin All Image Tags
- **Description:** Replace :latest tags with specific versions
- **Acceptance Criteria:**
  - `bitnami/kubectl:latest` replaced with specific version
  - All images in cleanup job use pinned versions
  - Preserve expiry job uses pinned versions
- **Estimate:** XS
- **Files:**
  - `k8s/platform/cleanup-job/cleanup-cronjob.yaml`
  - `k8s/platform/preserve-expiry/preserve-expiry-cronjob.yaml`

### T-024.4: Add NetworkPolicy Port Restrictions
- **Description:** Restrict ingress traffic to specific application ports
- **Acceptance Criteria:**
  - Ingress NetworkPolicy specifies port 3000
  - Port configurable via workflow/values
  - Tested with PR environment deployment
- **Estimate:** S
- **Files:** `k8s/ephemeral/network-policy-allow-ingress.yaml`

### T-024.5: Add Security Contexts to MinIO/MongoDB
- **Description:** Add explicit security contexts to database workloads
- **Acceptance Criteria:**
  - runAsNonRoot: true set for MinIO
  - runAsNonRoot: true set for MongoDB
  - runAsUser and fsGroup configured appropriately
  - Deployments still work with security context
- **Estimate:** S
- **Files:**
  - `charts/minio/templates/tenant.yaml`
  - `charts/minio/values.yaml`
  - `charts/mongodb/templates/mongodb.yaml`
  - `charts/mongodb/values.yaml`

### T-024.6: Document Security Model
- **Description:** Create security documentation for the platform
- **Acceptance Criteria:**
  - Security model documented
  - Network isolation explained
  - Secret management documented
  - Container security settings documented
- **Estimate:** M
- **Files:** `docs/guides/security.md`

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
