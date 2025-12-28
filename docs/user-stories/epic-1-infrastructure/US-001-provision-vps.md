# US-001: Provision VPS Server

**Status:** Done

## User Story

**As an** SRE/DevOps engineer,
**I want** a VPS server provisioned with the required specifications,
**So that** we have the infrastructure base for the Kubernetes cluster.

## Acceptance Criteria

- [x] VPS provisioned with minimum specs: 4 vCPU, 24GB RAM, 100GB NVMe
- [x] SSH access configured with key-based authentication
- [x] Root/sudo access available
- [ ] Basic firewall configured (ports 22, 80, 443, 6443)
- [x] Server accessible via stable IP or hostname

## Priority

**Must** - Critical for MVP

## Story Points

3

## Dependencies

None

## Implementation Details

### VPS Specifications

| Atributo | Valor |
|----------|-------|
| **Provedor** | Oracle Cloud Infrastructure (OCI) |
| **IP Público** | `168.138.151.63` |
| **Hostname** | `genilda` |
| **Usuário SSH** | `ubuntu` |
| **Porta SSH** | `22` |
| **OS** | Ubuntu 24.04.3 LTS (Noble Numbat) |
| **Kernel** | 6.14.0-1018-oracle |
| **Arquitetura** | ARM64 (aarch64) |

### Hardware

| Recurso | Especificação |
|---------|---------------|
| **vCPUs** | 4 |
| **RAM** | 24 GB |
| **Disco** | 96 GB |
| **Swap** | 2 GB |

### Access

```bash
ssh ubuntu@168.138.151.63
```

## Notes

- VPS is ARM64 architecture - all container images must support `linux/arm64`
- Oracle Cloud free tier provides generous ARM resources
- Firewall configuration pending (T-001.4)
