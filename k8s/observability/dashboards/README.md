# Grafana Dashboards

Custom Grafana dashboards for monitoring PR ephemeral environments.

## Dashboards

### PR Environment Overview

- **UID:** `pr-environment-overview`
- **Purpose:** High-level overview of a PR namespace
- **Panels:**
  - Running Pods count
  - CPU/Memory quota usage gauges
  - Pod restarts count
  - CPU usage by pod
  - Memory usage by pod
  - Network I/O
  - Recent logs (Loki)

### Application Metrics

- **UID:** `application-metrics`
- **Purpose:** Application-level metrics from demo-app
- **Panels:**
  - Request rate by route
  - Request duration (p50/p95/p99)
  - Error rate (5xx)
  - Requests by status code (pie chart)
  - Database connection pool
  - Database query duration
  - Node.js memory
  - Event loop lag

## Deployment

### Deploy dashboards to Grafana

```bash
# Create ConfigMap from JSON files with grafana_dashboard label
kubectl create configmap grafana-dashboards-ephemeral \
  --from-file=pr-environment-overview.json \
  --from-file=application-metrics.json \
  -n observability \
  --dry-run=client -o yaml | \
  kubectl apply -f -

# Add the required label for Grafana sidecar discovery
kubectl label configmap grafana-dashboards-ephemeral \
  grafana_dashboard=1 \
  -n observability --overwrite
```

### Verify deployment

```bash
# Check ConfigMap exists
kubectl get configmap grafana-dashboards-ephemeral -n observability

# Check Grafana sidecar picked up the dashboards
kubectl logs -l app.kubernetes.io/name=grafana -n observability -c grafana-sc-dashboard
```

### Access dashboards

1. Open Grafana: https://grafana.k8s-ee.genesluna.dev
2. Navigate to Dashboards > Browse
3. Look for "PR Environment Overview" and "Application Metrics"

## Variables

Both dashboards use a `namespace` variable that filters by PR namespaces:
- Query: `label_values(kube_namespace_labels{namespace=~".*-pr-.*"}, namespace)`
- This ensures only ephemeral PR namespaces appear in the dropdown

## Dependencies

### PR Environment Overview
- Prometheus metrics: kube-state-metrics, cadvisor
- Loki for logs

### Application Metrics
- Custom demo-app metrics (prom-client)
- ServiceMonitor configured in Helm chart
- Metrics endpoint: `/metrics`

## Troubleshooting

### Dashboards not appearing

1. Check ConfigMap has the correct label:
   ```bash
   kubectl get configmap grafana-dashboards-ephemeral -n observability -o yaml | grep grafana_dashboard
   ```

2. Restart Grafana to force sidecar reload:
   ```bash
   kubectl rollout restart deployment prometheus-grafana -n observability
   ```

### No data in Application Metrics

1. Verify ServiceMonitor is created:
   ```bash
   kubectl get servicemonitor -A | grep demo-app
   ```

2. Check Prometheus targets:
   - Port-forward: `kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090 -n observability`
   - Visit: http://localhost:9090/targets
   - Look for demo-app target
