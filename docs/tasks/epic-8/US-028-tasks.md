# Tasks for US-028: Publish Helm Charts to OCI Registry

**Status:** Draft

## Tasks

### T-028.1: Rename PostgreSQL Chart
- **Description:** Rename postgresql chart to k8s-ee-postgresql for OCI registry
- **Acceptance Criteria:**
  - Chart.yaml name changed to `k8s-ee-postgresql`
  - All internal references updated
  - Chart version bumped
- **Estimate:** XS
- **Files:** `charts/postgresql/Chart.yaml`

### T-028.2: Rename MongoDB Chart
- **Description:** Rename mongodb chart to k8s-ee-mongodb for OCI registry
- **Acceptance Criteria:**
  - Chart.yaml name changed to `k8s-ee-mongodb`
  - All internal references updated
  - Chart version bumped
- **Estimate:** XS
- **Files:** `charts/mongodb/Chart.yaml`

### T-028.3: Rename Redis Chart
- **Description:** Rename redis chart to k8s-ee-redis for OCI registry
- **Acceptance Criteria:**
  - Chart.yaml name changed to `k8s-ee-redis`
  - All internal references updated
  - Chart version bumped
- **Estimate:** XS
- **Files:** `charts/redis/Chart.yaml`

### T-028.4: Rename MinIO Chart
- **Description:** Rename minio chart to k8s-ee-minio for OCI registry
- **Acceptance Criteria:**
  - Chart.yaml name changed to `k8s-ee-minio`
  - All internal references updated
  - Chart version bumped
- **Estimate:** XS
- **Files:** `charts/minio/Chart.yaml`

### T-028.5: Create Chart Publishing Workflow
- **Description:** Create GitHub workflow to publish charts to GHCR on push
- **Acceptance Criteria:**
  - Workflow triggers on push to main with changes in `charts/`
  - Logs into GHCR using GITHUB_TOKEN
  - Packages each chart with `helm package`
  - Pushes to `oci://ghcr.io/genesluna/k8s-ephemeral-environments/charts/`
  - Supports semantic versioning from Chart.yaml
- **Estimate:** M
- **Files:** `.github/workflows/publish-charts.yml`

### T-028.6: Verify Chart Publishing
- **Description:** Test chart publishing and pulling from GHCR
- **Acceptance Criteria:**
  - All 4 charts published successfully
  - Charts can be pulled with `helm pull oci://...`
  - Chart versions match Chart.yaml
- **Estimate:** S
- **Files:** None (verification)

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
