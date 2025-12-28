# Tasks for US-017: Configure GitHub Actions Access to Cluster

## Tasks

### T-017.1: Create CI/CD ServiceAccount
- **Description:** Create ServiceAccount for GitHub Actions
- **Acceptance Criteria:**
  - ServiceAccount `github-actions` created
  - Located in appropriate namespace (kube-system or dedicated)
  - Token can be generated
- **Estimate:** S

### T-017.2: Define RBAC Permissions
- **Description:** Create Role/ClusterRole with required permissions
- **Acceptance Criteria:**
  - Can create/delete namespaces
  - Can deploy applications (deployments, services, ingresses)
  - Can manage secrets and configmaps
  - Can view pod logs
  - Cannot access other sensitive resources
- **Estimate:** S

### T-017.3: Generate kubeconfig
- **Description:** Create kubeconfig file for ServiceAccount
- **Acceptance Criteria:**
  - kubeconfig generated with SA token
  - Cluster endpoint configured correctly
  - Certificate authority included
  - Connection tested from outside cluster
- **Estimate:** S

### T-017.4: Store Credentials in GitHub
- **Description:** Add kubeconfig to GitHub Secrets
- **Acceptance Criteria:**
  - Secret `KUBECONFIG` created in repository
  - Secret properly formatted
  - Accessible to workflows
- **Estimate:** XS

### T-017.5: Test Workflow Access
- **Description:** Verify GitHub Actions can access cluster
- **Acceptance Criteria:**
  - Test workflow uses kubeconfig secret
  - `kubectl get nodes` works
  - `kubectl get namespaces` works
  - Permissions are correctly scoped
- **Estimate:** S

### T-017.6: Document Credential Rotation
- **Description:** Create runbook for rotating credentials
- **Acceptance Criteria:**
  - Steps to generate new token documented
  - Steps to update GitHub Secret documented
  - Verification steps included
- **Estimate:** S

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
