# Tasks for US-003: Configure Wildcard DNS

## Tasks

### T-003.1: Select DNS Strategy
- **Description:** Decide between owned domain with wildcard or nip.io
- **Acceptance Criteria:**
  - Strategy documented with pros/cons
  - Domain chosen (if using owned domain)
  - Decision approved by team
- **Estimate:** XS

### T-003.2: Create Wildcard DNS Record
- **Description:** Configure wildcard A record in DNS provider
- **Acceptance Criteria:**
  - A record created: `*.preview.domain.com` → VPS IP
  - TTL set appropriately (300-3600 seconds)
  - Record visible in DNS provider dashboard
- **Estimate:** XS

### T-003.3: Verify DNS Propagation
- **Description:** Confirm DNS is resolving correctly
- **Acceptance Criteria:**
  - `dig test.preview.domain.com` returns VPS IP
  - Multiple test subdomains resolve correctly
  - Propagation complete (check from multiple locations)
- **Estimate:** XS

### T-003.4: Define TLS Strategy
- **Description:** Decide how TLS certificates will be managed
- **Acceptance Criteria:**
  - Strategy chosen: cert-manager + Let's Encrypt wildcard, or per-ingress certs
  - If wildcard: DNS-01 challenge provider identified
  - Documentation updated with TLS approach
- **Estimate:** S

### T-003.5: Install cert-manager (if applicable)
- **Description:** Deploy cert-manager for automated TLS
- **Acceptance Criteria:**
  - cert-manager installed via Helm
  - ClusterIssuer created for Let's Encrypt
  - Test certificate issued successfully
- **Estimate:** M

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
