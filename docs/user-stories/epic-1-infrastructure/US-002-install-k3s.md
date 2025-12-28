# US-002: Install and Configure k3s Cluster

## User Story

**As an** SRE/DevOps engineer,
**I want** k3s installed and configured on the VPS,
**So that** we have a functional Kubernetes cluster for running workloads.

## Acceptance Criteria

- [ ] k3s installed in single-node mode
- [ ] kubectl configured and functional
- [ ] Traefik ingress controller enabled and running
- [ ] Local Path Provisioner configured for storage
- [ ] Cluster survives VPS reboot (auto-start)
- [ ] kubeconfig exported and securely stored

## Priority

**Must** - Critical for MVP

## Story Points

5

## Dependencies

- US-001: Provision VPS Server

## Notes

- Use latest stable k3s version
- Consider disabling servicelb if using Traefik
- Reserve ~20% resources for system overhead
