# Tasks for US-002: Install and Configure k3s Cluster

## Tasks

### T-002.1: Install k3s
- **Description:** Install k3s on the VPS using the official install script
- **Acceptance Criteria:**
  - k3s installed with latest stable version
  - k3s service running and enabled on boot
  - Single-node configuration
- **Estimate:** S

### T-002.2: Configure kubectl Access
- **Description:** Set up kubectl for cluster administration
- **Acceptance Criteria:**
  - kubeconfig file extracted from /etc/rancher/k3s/k3s.yaml
  - kubectl commands working (kubectl get nodes)
  - Server endpoint accessible
- **Estimate:** XS

### T-002.3: Verify Traefik Ingress
- **Description:** Confirm Traefik is running and functional
- **Acceptance Criteria:**
  - Traefik pods running in kube-system namespace
  - Traefik dashboard accessible (optional)
  - IngressRoute CRD available
- **Estimate:** S

### T-002.4: Configure Local Path Provisioner
- **Description:** Set up storage provisioner for PVCs
- **Acceptance Criteria:**
  - Local Path Provisioner deployed
  - StorageClass created and set as default
  - Test PVC can be created and bound
- **Estimate:** S

### T-002.5: Test Cluster Resilience
- **Description:** Verify cluster survives reboot
- **Acceptance Criteria:**
  - Reboot VPS
  - k3s service starts automatically
  - All system pods recover
  - kubectl access restored
- **Estimate:** S

### T-002.6: Export and Secure kubeconfig
- **Description:** Export kubeconfig for external access
- **Acceptance Criteria:**
  - kubeconfig exported with external IP/hostname
  - File stored in secure location (Vault, 1Password)
  - Access tested from local machine
- **Estimate:** S

### T-002.7: Document k3s Setup
- **Description:** Create runbook for k3s operations
- **Acceptance Criteria:**
  - Installation steps documented
  - Common commands documented
  - Troubleshooting guide started
- **Estimate:** S

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
