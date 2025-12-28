# Tasks for US-009: Create Isolated Database per PR

## Tasks

### T-009.1: Choose Database Strategy
- **Description:** Decide on database approach for PR environments
- **Acceptance Criteria:**
  - Evaluate options: CloudNativePG, PostgreSQL container, external DB
  - Document pros/cons of each
  - Select approach for MVP
  - Plan for Phase 2 evolution
- **Estimate:** S

### T-009.2: Create PostgreSQL Deployment Manifest
- **Description:** Create Kubernetes manifests for PostgreSQL
- **Acceptance Criteria:**
  - Deployment with PostgreSQL image
  - Service for internal access
  - PVC for data persistence (or emptyDir for ephemeral)
  - Resource limits defined
- **Estimate:** M

### T-009.3: Create Database Credentials Secret
- **Description:** Generate and store database credentials
- **Acceptance Criteria:**
  - Random password generated per PR
  - Secret created in namespace
  - Credentials include: host, port, user, password, database name
- **Estimate:** S

### T-009.4: Implement Database Initialization
- **Description:** Set up database schema on creation
- **Acceptance Criteria:**
  - Init container or job runs migrations
  - Schema created successfully
  - Optional: seed data loaded
- **Estimate:** M

### T-009.5: Add Database to Helm Chart
- **Description:** Include database in application Helm chart
- **Acceptance Criteria:**
  - PostgreSQL templates in chart
  - Values for database configuration
  - Application configured to use database
- **Estimate:** M

### T-009.6: Test Database Isolation
- **Description:** Verify databases are isolated between PRs
- **Acceptance Criteria:**
  - Open 2 PRs
  - Each has separate database
  - Data in one doesn't appear in other
  - Network policies prevent cross-access
- **Estimate:** S

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
