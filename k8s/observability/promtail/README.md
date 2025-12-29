# Promtail

Promtail is a log shipping agent that collects logs from Kubernetes pods and sends them to Loki.

## Overview

| Setting | Value |
|---------|-------|
| Deployment | DaemonSet (one per node) |
| Namespace | `observability` |
| Log Source | `/var/log/pods`, `/var/log/containers` |
| Target | Loki Gateway at `http://loki-gateway.observability.svc.cluster.local` |
| Memory Limit | 128Mi |

## Prerequisites

- Helm 3.x
- Loki deployed and running
- `observability` namespace created

## Installation

```bash
# Add Grafana Helm repository (if not already added)
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Promtail
helm upgrade --install promtail grafana/promtail \
  --namespace observability \
  --values k8s/observability/promtail/values.yaml \
  --wait --timeout 5m
```

## Verify Installation

```bash
# Check DaemonSet is running
kubectl get daemonset -n observability promtail

# Check pods are running on all nodes
kubectl get pods -n observability -l app.kubernetes.io/name=promtail -o wide

# Check Promtail logs
kubectl logs -n observability -l app.kubernetes.io/name=promtail --tail=50
```

## Configuration

### Labels Extracted

Promtail extracts the following labels from Kubernetes metadata:

| Label | Source |
|-------|--------|
| `namespace` | Pod namespace |
| `pod` | Pod name |
| `container` | Container name |
| `node` | Node where pod runs |
| `app` | `app` label on pod |
| `app_name` | `app.kubernetes.io/name` label |
| `component` | `app.kubernetes.io/component` label |
| `job` | `namespace/pod` |

### Log Paths

k3s uses containerd which stores logs in:

- `/var/log/pods/<namespace>_<pod>_<uid>/<container>/*.log`
- `/var/log/containers/<pod>_<namespace>_<container>-<id>.log` (symlinks)

Promtail mounts both paths to ensure complete log coverage.

### Pipeline Stages

The scrape configuration uses:

1. **CRI stage**: Parses containerd/CRI log format
2. **Relabel configs**: Extracts Kubernetes metadata as labels

## Querying Logs with Labels

Use the extracted labels in Grafana/LogQL:

```logql
# All logs from a namespace
{namespace="default"}

# Specific pod logs
{namespace="observability", pod="loki-0"}

# All containers in a pod
{namespace="observability", pod=~"prometheus-.*"}

# Filter by app label
{app="demo-app"}

# PR environment logs (regex match)
{namespace=~"k8s-ee-pr-.*"}

# Combine with text search
{namespace="observability", container="loki"} |= "error"
```

## Resource Usage

| Setting | Request | Limit |
|---------|---------|-------|
| CPU | 50m | 200m |
| Memory | 64Mi | 128Mi |

## Upgrade

```bash
helm repo update
helm upgrade promtail grafana/promtail \
  --namespace observability \
  --values k8s/observability/promtail/values.yaml \
  --wait --timeout 5m
```

## Uninstallation

```bash
helm uninstall promtail -n observability
```

## Troubleshooting

### Promtail Not Collecting Logs

```bash
# Check Promtail is running
kubectl get pods -n observability -l app.kubernetes.io/name=promtail

# Check Promtail logs for errors
kubectl logs -n observability -l app.kubernetes.io/name=promtail --tail=100

# Verify log paths exist on node
ssh ubuntu@168.138.151.63 'ls -la /var/log/pods/ | head -10'
```

### Logs Not Appearing in Loki

1. Check Promtail can reach Loki:
   ```bash
   kubectl exec -n observability -l app.kubernetes.io/name=promtail -- wget -qO- http://loki-gateway.observability.svc.cluster.local/ready
   ```

2. Check for connection errors in Promtail logs:
   ```bash
   kubectl logs -n observability -l app.kubernetes.io/name=promtail | grep -i error
   ```

3. Verify Loki is accepting pushes:
   ```bash
   kubectl logs -n observability loki-0 | grep -i "push" | tail -10
   ```

### High Memory Usage

If Promtail is using too much memory:

1. Check for high log volume pods
2. Consider adding drop rules for noisy logs
3. Increase limits if justified

### Missing Labels

If expected labels are not appearing:

1. Verify pod has the expected labels:
   ```bash
   kubectl get pod <pod-name> -n <namespace> -o yaml | grep -A10 labels
   ```

2. Check Promtail relabel configuration in values.yaml

## References

- [Promtail Documentation](https://grafana.com/docs/loki/latest/send-data/promtail/)
- [Promtail Configuration](https://grafana.com/docs/loki/latest/send-data/promtail/configuration/)
- [Promtail Helm Chart](https://github.com/grafana/helm-charts/tree/main/charts/promtail)
