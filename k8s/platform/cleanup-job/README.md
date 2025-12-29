# Cleanup Job for Orphaned Resources

This CronJob automatically cleans up orphaned PR namespaces that weren't properly
destroyed when their corresponding PRs were closed.

## Overview

| Setting | Value |
|---------|-------|
| Schedule | Every 6 hours (0:00, 6:00, 12:00, 18:00 UTC) |
| Purpose | Safety net for failed webhook-based cleanup |
| Age Threshold | Only deletes namespaces older than 24 hours |
| Image | `bitnami/kubectl:latest` (ARM64 compatible) |

> **Note:** We use `:latest` instead of a pinned version because specific version tags
> (e.g., `1.30`, `1.31`) lack ARM64 images on Docker Hub. The `:latest` tag includes
> multi-arch support for both amd64 and arm64.

## Prerequisites

1. Platform namespace exists
2. GitHub PAT with `repo` scope (for private repos) or `public_repo` scope
3. kube-prometheus-stack for alerting (optional)

## Installation

### 1. Create the platform namespace

```bash
kubectl apply -f k8s/platform/namespace.yaml
```

### 2. Create the GitHub token secret

Generate a GitHub Personal Access Token with `repo` scope, then:

```bash
kubectl create secret generic github-cleanup-token \
  --namespace platform \
  --from-literal=GITHUB_TOKEN="ghp_your_token_here"
```

### 3. Apply the manifests

```bash
kubectl apply -f k8s/platform/cleanup-job/cleanup-rbac.yaml
kubectl apply -f k8s/platform/cleanup-job/cleanup-configmap.yaml
kubectl apply -f k8s/platform/cleanup-job/cleanup-cronjob.yaml
```

### 4. Apply alerting rules (if Prometheus is installed)

```bash
kubectl apply -f k8s/platform/alerts/cleanup-alerts.yaml
```

## Manual Execution

To run the cleanup job immediately:

```bash
kubectl create job --from=cronjob/cleanup-orphaned-namespaces manual-cleanup -n platform
```

To run in dry-run mode (no actual deletions):

```bash
kubectl create job manual-cleanup-dry -n platform --from=cronjob/cleanup-orphaned-namespaces --dry-run=client -o yaml | \
  sed 's/value: "false"/value: "true"/' | \
  kubectl apply -f -
```

## Viewing Logs

```bash
# Latest job logs
kubectl logs -n platform -l app.kubernetes.io/name=cleanup-job --tail=100

# Specific job logs
kubectl logs -n platform job/<job-name>

# List all cleanup jobs
kubectl get jobs -n platform -l app.kubernetes.io/name=cleanup-job
```

## Safety Checks

The cleanup job includes multiple safety mechanisms:

| Check | Description |
|-------|-------------|
| Label verification | Only targets namespaces with `k8s-ee/type=ephemeral` |
| Ownership check | Verifies `app.kubernetes.io/managed-by=github-actions` |
| Age threshold | Skips namespaces younger than 24 hours |
| Preserve label | Respects `preserve=true` for US-021 compatibility |
| GitHub API verification | Confirms PR is actually closed before deletion |
| Repository check | Validates `k8s-ee/repository` annotation format |

## Configuration

Environment variables in the CronJob:

| Variable | Default | Description |
|----------|---------|-------------|
| `GITHUB_TOKEN` | (required) | GitHub PAT for API access |
| `CLEANUP_AGE_HOURS` | `24` | Minimum namespace age for cleanup |
| `DRY_RUN` | `false` | Set to `true` for testing |

## Troubleshooting

### Job not running

Check CronJob status:

```bash
kubectl get cronjob -n platform
kubectl describe cronjob cleanup-orphaned-namespaces -n platform
```

### Permission errors

Verify RBAC:

```bash
kubectl auth can-i delete namespaces --as=system:serviceaccount:platform:cleanup-job-sa
kubectl auth can-i list namespaces --as=system:serviceaccount:platform:cleanup-job-sa
```

### GitHub API errors

Check token validity:

```bash
# Verify secret exists
kubectl get secret github-cleanup-token -n platform

# Test token (first 10 chars only for security)
kubectl get secret github-cleanup-token -n platform -o jsonpath='{.data.GITHUB_TOKEN}' | base64 -d | head -c 10
echo "..."
```

### Namespace not being deleted

Check namespace labels:

```bash
kubectl get namespace <name> -o yaml | grep -A 20 labels
kubectl get namespace <name> -o yaml | grep -A 10 annotations
```

Ensure the namespace has:
- Label: `k8s-ee/type: ephemeral`
- Label: `app.kubernetes.io/managed-by: github-actions`
- Label: `k8s-ee/pr-number: <number>`
- Annotation: `k8s-ee/repository: owner/repo`
- Annotation: `k8s-ee/created-at: <ISO 8601 timestamp>`

## Related Documentation

- [Operational Runbook](../../../docs/runbooks/cleanup-job.md)
- [US-020 User Story](../../../docs/user-stories/epic-6-security/US-020-cleanup-job.md)
- [US-021 Preserve Environment](../../../docs/user-stories/epic-6-security/US-021-preserve-environment.md)
