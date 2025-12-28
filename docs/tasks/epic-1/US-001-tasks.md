# Tasks for US-001: Provision VPS Server

## Tasks

### T-001.1: Select VPS Provider
- **Status:** Done
- **Description:** Evaluate and select VPS provider based on cost, specs, and reliability
- **Acceptance Criteria:**
  - ~~Compare at least 3 providers (DigitalOcean, Hetzner, Vultr)~~
  - ~~Document pricing for 4 vCPU / 24GB RAM / 100GB NVMe~~
  - ~~Select provider and justify decision~~
- **Result:** Oracle Cloud Infrastructure (OCI) selected - Free tier ARM instances
- **Estimate:** S

### T-001.2: Provision VPS Instance
- **Status:** Done
- **Description:** Create the VPS instance with required specifications
- **Acceptance Criteria:**
  - ~~Instance created with 4 vCPU, 24GB RAM, 100GB NVMe~~
  - ~~Ubuntu 22.04 LTS or Debian 12 installed~~
  - ~~Static IP assigned~~
- **Result:**
  - IP: `168.138.151.63`
  - Hostname: `genilda`
  - OS: Ubuntu 24.04.3 LTS
  - Arch: ARM64 (aarch64)
  - Specs: 4 vCPU, 24GB RAM, 96GB disk
- **Estimate:** S

### T-001.3: Configure SSH Access
- **Status:** Done
- **Description:** Set up secure SSH access to the server
- **Acceptance Criteria:**
  - ~~SSH key-based authentication enabled~~
  - ~~Password authentication disabled~~
  - ~~SSH port configured (22 or custom)~~
  - ~~SSH keys added for team members~~
- **Result:** SSH access via `ubuntu@168.138.151.63` with key auth
- **Estimate:** S

### T-001.4: Configure Basic Firewall
- **Status:** To Do
- **Description:** Set up firewall rules for required services
- **Acceptance Criteria:**
  - UFW or iptables configured
  - Port 22 (SSH) open
  - Port 80 (HTTP) open
  - Port 443 (HTTPS) open
  - Port 6443 (Kubernetes API) open
  - All other ports blocked by default
- **Estimate:** S

### T-001.5: Document Server Access
- **Status:** Done
- **Description:** Create runbook documenting server access
- **Acceptance Criteria:**
  - ~~Server IP/hostname documented~~
  - ~~SSH connection instructions documented~~
  - ~~Credentials stored securely (e.g., 1Password, Vault)~~
- **Result:** Documented in PRD Appendix A and runbook
- **Estimate:** S

---

## Summary

| Task | Status |
|------|--------|
| T-001.1 | Done |
| T-001.2 | Done |
| T-001.3 | Done |
| T-001.4 | To Do |
| T-001.5 | Done |

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
