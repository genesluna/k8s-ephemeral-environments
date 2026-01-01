# Tasks for US-034: Organization Allowlist

**Status:** Done
**Story Points:** 3

## Tasks

### T-034.1: Create Allowlist Configuration File ✅
- **Description:** Create allowed-orgs.json configuration file
- **Acceptance Criteria:**
  - File at `.github/config/allowed-orgs.json`
  - Mode, organizations, and repositories fields
  - Initial orgs: genesluna, koder-cat
- **Estimate:** XS
- **Files:** `.github/config/allowed-orgs.json`

### T-034.2: Create JSON Schema ✅
- **Description:** Create JSON Schema for allowlist validation
- **Acceptance Criteria:**
  - Schema validates mode enum (allowlist, denylist, disabled)
  - Organizations array validated
  - Repository override pattern validated
- **Estimate:** S
- **Files:** `.github/config/allowed-orgs.schema.json`

### T-034.3: Add Validation Step ✅
- **Description:** Add organization validation to validate-config action
- **Acceptance Criteria:**
  - Extract org from repository input
  - Case-insensitive matching
  - Clear error message for unauthorized orgs
  - Fail-safe: empty allowlist denies all
- **Estimate:** M
- **Files:** `.github/actions/validate-config/action.yml`

### T-034.4: Update Sparse Checkout ✅
- **Description:** Update reusable workflow to include config directory
- **Acceptance Criteria:**
  - Sparse checkout includes `.github/config`
  - Only for jobs that need config (validate-config)
- **Estimate:** XS
- **Files:** `.github/workflows/pr-environment-reusable.yml`

### T-034.5: Create CODEOWNERS ✅
- **Description:** Create CODEOWNERS file to protect security-sensitive files
- **Acceptance Criteria:**
  - Protect allowed-orgs.json
  - Protect workflow and action files
  - Protect Kubernetes manifests
- **Estimate:** XS
- **Files:** `.github/CODEOWNERS`

### T-034.6: Create Access Control Documentation ✅
- **Description:** Create comprehensive access control documentation
- **Acceptance Criteria:**
  - Explains how the allowlist works
  - Documents all configuration options
  - Includes examples for common scenarios
  - Explains how to request access
- **Estimate:** M
- **Files:** `docs/guides/access-control.md`

### T-034.7: Update Security Documentation ✅
- **Description:** Update security.md with allowlist information
- **Acceptance Criteria:**
  - Add access control to security overview
  - Document security properties
  - Link to access-control.md
- **Estimate:** S
- **Files:** `docs/guides/security.md`

### T-034.8: Update Onboarding and Troubleshooting ✅
- **Description:** Update onboarding and troubleshooting docs
- **Acceptance Criteria:**
  - Prerequisites section in onboarding
  - Authorization error troubleshooting entry
- **Estimate:** S
- **Files:** `docs/guides/onboarding-new-repo.md`, `docs/guides/troubleshooting.md`

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
