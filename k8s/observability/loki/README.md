# Loki

Loki is a horizontally-scalable, highly-available log aggregation system. This deployment uses SingleBinary mode optimized for a single-node k3s cluster.

## Overview

| Setting | Value |
|---------|-------|
| Mode | SingleBinary |
| Namespace | `observability` |
| Storage | Filesystem (local-path PVC) |
| Retention | 7 days |
| Memory Limit | 1Gi |

## Prerequisites

- Helm 3.x
- k3s cluster with `local-path` storage class
- `observability` namespace created

## Installation

```bash
# Add Grafana Helm repository
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Loki
helm upgrade --install loki grafana/loki \
  --namespace observability \
  --values k8s/observability/loki/values.yaml \
  --wait --timeout 5m
```

## Verify Installation

```bash
# Check pods are running
kubectl get pods -n observability -l app.kubernetes.io/name=loki

# Check Loki readiness
kubectl exec -n observability loki-0 -- wget -qO- http://localhost:3100/ready

# Check Loki metrics
kubectl exec -n observability loki-0 -- wget -qO- http://localhost:3100/metrics | head -20
```

## Configuration

### Key Settings

| Setting | Value | Description |
|---------|-------|-------------|
| `deploymentMode` | `SingleBinary` | All components in single process |
| `loki.auth_enabled` | `false` | Single-tenant mode |
| `loki.limits_config.retention_period` | `168h` | 7 days log retention |
| `singleBinary.persistence.size` | `5Gi` | Storage for logs |
| `singleBinary.resources.limits.memory` | `1Gi` | Memory limit |

### Storage

Loki stores data on a persistent volume using k3s's `local-path` provisioner:

- **Location**: `/var/lib/rancher/k3s/storage/` on the node
- **Size**: 5Gi
- **Data**: Index and chunks stored in filesystem

### Retention

Retention is handled by the compactor:
- Logs older than 7 days are automatically deleted
- Compactor runs periodically to enforce retention
- Storage is reclaimed after deletion

## Querying Logs

Logs can be queried through Grafana using LogQL:

```logql
# All logs from a namespace
{namespace="observability"}

# Logs from a specific pod
{namespace="observability", pod="loki-0"}

# Filter by log content
{namespace="observability"} |= "error"

# PR environment logs
{namespace=~"k8s-ee-pr-.*"}
```

## Resource Usage

| Component | Memory Request | Memory Limit |
|-----------|----------------|--------------|
| Loki SingleBinary | 256Mi | 1Gi |
| Gateway | 32Mi | 64Mi |

## Upgrade

```bash
helm repo update
helm upgrade loki grafana/loki \
  --namespace observability \
  --values k8s/observability/loki/values.yaml \
  --wait --timeout 5m
```

## Uninstallation

```bash
# Delete Helm release
helm uninstall loki -n observability

# Delete PVC (removes all log data)
kubectl delete pvc -n observability -l app.kubernetes.io/name=loki
```

## Troubleshooting

### Loki Not Ready

```bash
# Check pod status
kubectl describe pod -n observability -l app.kubernetes.io/name=loki

# Check logs
kubectl logs -n observability -l app.kubernetes.io/name=loki --tail=100
```

### Storage Issues

```bash
# Check PVC status
kubectl get pvc -n observability -l app.kubernetes.io/name=loki

# Check disk usage on node
ssh ubuntu@168.138.151.63 'df -h /var/lib/rancher/k3s/storage'
```

### High Memory Usage

If Loki is using too much memory:

1. Reduce retention period in `values.yaml`
2. Lower ingestion rate limits
3. Check for high-cardinality labels

### No Logs Appearing

1. Verify Promtail is running and sending logs
2. Check Loki is accepting connections: `kubectl logs -n observability loki-0 | grep -i error`
3. Verify Grafana Loki datasource URL is correct

## References

- [Loki Documentation](https://grafana.com/docs/loki/latest/)
- [LogQL Query Language](https://grafana.com/docs/loki/latest/query/)
- [Loki Helm Chart](https://github.com/grafana/loki/tree/main/production/helm/loki)
