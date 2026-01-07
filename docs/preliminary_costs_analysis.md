# Preliminary Cloud Infrastructure Cost Analysis

**Version:** 2.0
**Date:** January 2025
**Author:** Engineering Team
**Status:** Draft - For Planning Purposes

---

## Executive Summary

This document provides a comprehensive cost analysis for migrating the k8s-ephemeral-environments platform from the current free-tier Oracle Cloud VPS to a production-grade managed Kubernetes infrastructure with **mandatory autoscaling**.

### Key Metrics

| Metric | Value |
|--------|-------|
| **Concurrent PR Capacity** | 40 PRs (80% of 50) |
| **Monthly PR Throughput** | ~557 PRs |
| **Average PR Lifecycle** | 2.15 days |
| **Autoscaling** | **REQUIRED** |

### Cost Summary (with Autoscaling)

| Cloud Provider | Monthly Cost | Cost per PR | Notes |
|----------------|--------------|-------------|-------|
| **Oracle Cloud** | $301 | **$0.54** | Best value, free networking |
| **GCP** | $468 | $0.84 | Free control plane |
| **Azure** | $601 | $1.08 | Free AKS tier available |
| **AWS** | $670 | $1.20 | Most mature, highest cost |

**Recommendation:** Oracle Cloud remains the most cost-effective option, offering 35-55% savings compared to AWS/GCP/Azure, primarily due to free NAT Gateway, free egress (10TB/month), and competitive compute pricing.

---

## Table of Contents

1. [PR Lifecycle & Throughput Model](#1-pr-lifecycle--throughput-model)
2. [Autoscaling Architecture (REQUIRED)](#2-autoscaling-architecture-required)
3. [Current Infrastructure Analysis](#3-current-infrastructure-analysis)
4. [Resource Requirements](#4-resource-requirements)
5. [Multi-Architecture Considerations](#5-multi-architecture-considerations)
6. [Cloud Provider Comparison](#6-cloud-provider-comparison)
7. [Hidden Costs Analysis](#7-hidden-costs-analysis)
8. [Capacity Planning](#8-capacity-planning)
9. [Recommendations](#9-recommendations)
10. [Sources](#10-sources)

---

## 1. PR Lifecycle & Throughput Model

### 1.1 The Key Insight

**Cost per PR must be calculated based on throughput, not concurrent capacity.**

PRs are ephemeral by nature - they are created, used for review/testing, and destroyed when merged. The infrastructure cost is amortized across ALL PRs that flow through the system, not just the ones running at any given moment.

### 1.2 PR Lifecycle Distribution

| PR Type | Percentage | Avg Lifecycle | Description |
|---------|------------|---------------|-------------|
| **Short-lived** | 90% | ~2 days | Normal PR flow: open → review → merge |
| **Preserved** | 10% | ~7 days | Extended testing, `/preserve` command |
| **Weighted Average** | 100% | **2.15 days** | Used for calculations |

### 1.3 Throughput Calculation

```
Concurrent Slots: 40 PRs (80% of 50 capacity)

Short-lived PRs (90% of slots):
├── Slots: 36
├── Lifecycle: 2 days
└── Monthly throughput: 36 × 30 / 2 = 540 PRs

Preserved PRs (10% of slots):
├── Slots: 4
├── Lifecycle: 7 days
└── Monthly throughput: 4 × 30 / 7 = 17 PRs

TOTAL MONTHLY THROUGHPUT: ~557 PRs
```

### 1.4 Work Hours & Utilization Pattern

PRs are primarily created and used during business hours:

```
Weekly Activity Pattern:
├─ Peak (work hours):     40 concurrent PRs   │ 10 hrs × 5 days = 50 hrs (30%)
├─ Off-peak (evening):    15-20 concurrent    │ 6 hrs × 5 days = 30 hrs (18%)
├─ Night (midnight-6am):  5-10 concurrent     │ 8 hrs × 5 days = 40 hrs (24%)
└─ Weekend:               5-10 concurrent     │ 48 hrs (28%)

Weighted Average Utilization: ~45% of peak capacity
```

### 1.5 Cost per PR Formula

```
Cost per PR = Monthly Infrastructure Cost / Monthly PR Throughput
            = $301 (Oracle example) / 557 PRs
            = $0.54 per PR
```

**This is the key metric for evaluating infrastructure efficiency.**

---

## 2. Autoscaling Architecture (REQUIRED)

### 2.1 Why Autoscaling is Mandatory

Without autoscaling, you pay for peak capacity 24/7:

| Scenario | Monthly Compute Cost | Utilization | Waste |
|----------|---------------------|-------------|-------|
| **No autoscaling** | $432 | 100% billed | 55% wasted |
| **With autoscaling** | $195 | 45% billed | 0% wasted |
| **Savings** | **$237/month** | | **55%** |

**Autoscaling is not optional - it's required for cost-effective operation.**

### 2.2 Target Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Managed Kubernetes (EKS/GKE/AKS/OKE)                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                 FIXED: System Node Pool                          │   │
│  │                 (Always running, cannot scale down)              │   │
│  │                                                                  │   │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │   │ Observability│  │     ARC      │  │   Ingress    │          │   │
│  │   │  Prometheus  │  │  Controller  │  │  Controller  │          │   │
│  │   │  Loki        │  │              │  │  (Traefik)   │          │   │
│  │   │  Grafana     │  │              │  │              │          │   │
│  │   └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │                                                                  │   │
│  │   Resources: ~4-8 vCPU, 16-24GB RAM                              │   │
│  │   Cost: ~$100-150/month (FIXED)                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                 VARIABLE: PR Node Pool                           │   │
│  │                 (Autoscales 0-N based on demand)                 │   │
│  │                                                                  │   │
│  │   Peak (work hours):        ████████████████████  40 PRs        │   │
│  │   Off-peak (evening):       ████████████          20 PRs        │   │
│  │   Night/Weekend:            ████                   8 PRs        │   │
│  │                                                                  │   │
│  │   Scaling triggers:                                              │   │
│  │   ├── Scale UP:   PR created → pending pods → add node          │   │
│  │   ├── Scale DOWN: PR closed → pods terminated → remove node     │   │
│  │   └── Hibernation: Low activity detected → consolidate nodes    │   │
│  │                                                                  │   │
│  │   Cost: $0-400/month (VARIABLE, ~45% avg utilization)            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                 FIXED: Infrastructure                            │   │
│  │                                                                  │   │
│  │   Control Plane ─── NAT Gateway ─── Load Balancer ─── Storage   │   │
│  │                                                                  │   │
│  │   Cost: $25-175/month (varies by cloud)                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Autoscaling Components by Cloud

| Cloud | Node Autoscaler | Serverless Option | Recommended |
|-------|-----------------|-------------------|-------------|
| **AWS** | Karpenter, Cluster Autoscaler | Fargate | Karpenter |
| **GCP** | Cluster Autoscaler | GKE Autopilot | Autopilot |
| **Azure** | Cluster Autoscaler (VMSS) | ACI | Cluster Autoscaler |
| **Oracle** | Cluster Autoscaler | Virtual Nodes | Cluster Autoscaler |

### 2.4 Autoscaling Requirements

| Requirement | Purpose | Priority |
|-------------|---------|----------|
| **Resource requests on all pods** | Scheduler needs to know resource needs | CRITICAL |
| **Node autoscaler configured** | Scale nodes based on pending pods | CRITICAL |
| **Separate node pools** | Isolate system from PR workloads | HIGH |
| **PodDisruptionBudgets** | Safe node drain during scale-down | HIGH |
| **Pod priorities** | System pods don't get evicted | MEDIUM |
| **Scale-down delay** | Avoid thrashing on bursty workloads | MEDIUM |

### 2.5 Cost Breakdown: Fixed vs Variable

| Component | Type | Oracle | GCP | Azure | AWS |
|-----------|------|--------|-----|-------|-----|
| Control Plane | Fixed | $0 | $0 | $0 | $73 |
| NAT Gateway | Fixed | $0 | $64 | $66 | $66 |
| Load Balancer | Fixed | $10 | $18 | $18 | $18 |
| Storage (PVCs) | Fixed | $15 | $20 | $20 | $16 |
| System Node Pool | Fixed | $150 | $150 | $150 | $150 |
| **Fixed Subtotal** | | **$175** | **$252** | **$254** | **$323** |
| PR Node Pool (full) | Variable | $280 | $480 | $770 | $770 |
| PR Node Pool (45%) | Variable | $126 | $216 | $347 | $347 |
| **Total (with autoscaling)** | | **$301** | **$468** | **$601** | **$670** |

---

## 3. Current Infrastructure Analysis

### 3.1 Current VPS Specifications

| Specification | Value |
|---------------|-------|
| **Provider** | Oracle Cloud Infrastructure (OCI) |
| **Instance Type** | VM.Standard.A1.Flex (ARM) |
| **vCPUs** | 4 OCPU (4 vCPU on ARM) |
| **RAM** | 24 GB |
| **Storage** | 96 GB NVMe |
| **Cost** | **$0/month** (Always Free Tier) |
| **Architecture** | ARM64 (Ampere A1) |
| **OS** | Ubuntu 24.04 LTS |

### 3.2 Current Resource Utilization

Based on actual cluster measurements (`kubectl top nodes`):

| Metric | Used | Available | Utilization |
|--------|------|-----------|-------------|
| **CPU** | 216m | 4000m | **5%** |
| **Memory** | 6.3 GB | 24 GB | **26%** |
| **Disk** | 38 GB | 96 GB | **40%** |

### 3.3 Current Workload (4 PR Environments)

| Namespace | Actual CPU | Quota Limit | Actual Memory | Quota Limit |
|-----------|------------|-------------|---------------|-------------|
| k8s-ee-pr-90 | 34m | 3565m | 394Mi | 3532Mi |
| todo-app-pr-2 | 7m | 1265m | 91Mi | 1766Mi |
| todo-app-dotnet-pr-2 | 9m | 1265m | 116Mi | 1766Mi |
| todo-app-java-pr-2 | 0m | 1840m | 0Mi | 1913Mi |
| **observability** | 195m | - | 2086Mi | - |

**Key Insight:** Applications use only **1-3% of their allocated quota** at rest. The observability stack consumes the majority of baseline resources.

### 3.4 Current Limitations

| Limitation | Impact |
|------------|--------|
| **Single node** | No node autoscaling possible |
| **Fixed capacity** | Pay for peak even when idle |
| **No HA** | Single point of failure |
| **Limited scale** | Max 10-15 concurrent PRs |

**This is why migration to managed Kubernetes with autoscaling is required for scale.**

---

## 4. Resource Requirements

### 4.1 Per-PR Resource Consumption

Based on actual cluster measurements:

| State | CPU | Memory | Storage |
|-------|-----|--------|---------|
| **Idle** | 15m | 150Mi | 3Gi avg |
| **Active (moderate load)** | 500m | 800Mi | 3Gi avg |
| **Active (heavy load)** | 1000m | 1.5Gi | 5Gi avg |

### 4.2 Database Resource Requirements

Per the dynamic quota system in `k8s/ephemeral/resource-quota.yaml`:

| Database | CPU Addition | Memory Addition | Storage Addition |
|----------|--------------|-----------------|------------------|
| Base App | 300m | 512Mi | 1Gi |
| PostgreSQL | +500m | +512Mi | +2Gi |
| MongoDB | +500m | +512Mi | +2Gi |
| Redis | +200m | +128Mi | - |
| MinIO | +500m | +512Mi | +2Gi |
| MariaDB | +300m | +256Mi | +2Gi |
| **All DBs** | 2100m | 2432Mi | 9Gi |

### 4.3 System Node Pool Requirements (Fixed)

Components that must run 24/7:

| Component | CPU | Memory | Storage | Notes |
|-----------|-----|--------|---------|-------|
| Prometheus | 500m | 1.5Gi | 10Gi | Metrics collection |
| Loki | 300m | 1Gi | 5Gi | Log aggregation |
| Grafana | 200m | 256Mi | 2Gi | Dashboards |
| Promtail | 200m | 128Mi | - | DaemonSet |
| ARC Controller | 200m | 256Mi | - | GitHub webhooks |
| Ingress | 200m | 256Mi | - | Traffic routing |
| **Total** | **~2 vCPU** | **~4Gi** | **~17Gi** | |
| **With headroom** | **4-8 vCPU** | **16-24Gi** | **50Gi** | Recommended |

### 4.4 PR Node Pool Requirements (Variable)

For 40 concurrent PRs at peak:

| Component | CPU | Memory |
|-----------|-----|--------|
| 40 PRs (avg with PostgreSQL) | 40 × 500m = 20,000m | 40 × 800Mi = 32Gi |
| **+25% headroom** | **~25 cores** | **~40Gi** |

**This scales down to near-zero during nights/weekends with autoscaling.**

---

## 5. Multi-Architecture Considerations

### 5.1 ARM vs x86 Support by Cloud Provider

| Cloud | ARM Support | ARM Regions | ARM Instance Types | Maturity |
|-------|-------------|-------------|-------------------|----------|
| **AWS** | Excellent | All major | Graviton3/4 (m7g, c7g, r7g) | Production-ready |
| **Oracle** | Good | All regions | Ampere A1 Flex | Production-ready |
| **GCP** | Limited | 5 regions only | Tau T2A | Preview/Limited |
| **Azure** | Limited | 14 regions | Cobalt 100 (Dpsv6) | Recently GA |

### 5.2 Recommendation

**Favor x86 for maximum compatibility.** Use ARM only when:
- Deploying to AWS (mature Graviton ecosystem)
- Deploying to Oracle Cloud (all-region Ampere A1 support)
- Cost savings are critical (ARM is 12-30% cheaper)

**Hybrid Strategy:** Build multi-arch container images, deploy x86 initially, add ARM nodes later for cost optimization.

---

## 6. Cloud Provider Comparison

### 6.1 AWS (EKS)

#### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS EKS                              │
│  ┌─────────────────┐                                        │
│  │  EKS Control    │  ┌──────────────────────────────────┐  │
│  │  Plane ($73/mo) │  │  System Node Pool (Fixed)        │  │
│  └─────────────────┘  │  1× m6i.xlarge (4 vCPU, 16GB)    │  │
│                       │  Cost: ~$150/mo                   │  │
│  ┌─────────────────┐  └──────────────────────────────────┘  │
│  │  Karpenter      │                                        │
│  │  (Autoscaler)   │  ┌──────────────────────────────────┐  │
│  └─────────────────┘  │  PR Node Pool (Autoscaled)       │  │
│                       │  0-4× m6i.2xlarge based on demand │  │
│  ┌─────────────────┐  │  Cost: $0-770/mo (avg $347)      │  │
│  │  NAT + ALB      │  └──────────────────────────────────┘  │
│  │  ($132/mo)      │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

#### Cost Breakdown

| Item | Type | Monthly Cost |
|------|------|--------------|
| EKS Control Plane | Fixed | $73 |
| NAT Gateway (2× HA) | Fixed | $66 |
| ALB + Data Processing | Fixed | $57 |
| EBS Storage | Fixed | $16 |
| Route 53 | Fixed | $2 |
| System Node Pool | Fixed | $150 |
| **Fixed Subtotal** | | **$364** |
| PR Nodes (at 45% avg) | Variable | $347 |
| **Total with Autoscaling** | | **$670/mo** |
| **Cost per PR** | | **$1.20** |

---

### 6.2 GCP (GKE)

#### Architecture (Autopilot Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│                    GCP GKE Autopilot                        │
│  ┌─────────────────┐                                        │
│  │  GKE Control    │  ┌──────────────────────────────────┐  │
│  │  Plane (FREE)   │  │  Autopilot (Serverless)          │  │
│  └─────────────────┘  │  Pay per pod CPU/Memory/Storage  │  │
│                       │  Automatic node management        │  │
│  ┌─────────────────┐  │  Built-in autoscaling            │  │
│  │  Cloud NAT      │  └──────────────────────────────────┘  │
│  │  ($73/mo)       │                                        │
│  └─────────────────┘  System pods: ~$150/mo (always on)     │
│                       PR pods: ~$216/mo (45% avg)           │
│  ┌─────────────────┐                                        │
│  │  Cloud LB       │                                        │
│  │  ($18/mo)       │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

#### Cost Breakdown

| Item | Type | Monthly Cost |
|------|------|--------------|
| GKE Control Plane | Fixed | $0 (free credit) |
| Cloud NAT + Data | Fixed | $73 |
| Cloud Load Balancer | Fixed | $18 |
| Persistent Disk | Fixed | $34 |
| System Pods (Autopilot) | Fixed | $150 |
| **Fixed Subtotal** | | **$275** |
| PR Pods (at 45% avg) | Variable | $216 |
| **Total with Autoscaling** | | **$468/mo** |
| **Cost per PR** | | **$0.84** |

---

### 6.3 Azure (AKS)

#### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Azure AKS                            │
│  ┌─────────────────┐                                        │
│  │  AKS Control    │  ┌──────────────────────────────────┐  │
│  │  Plane (FREE)   │  │  System Node Pool (Fixed)        │  │
│  └─────────────────┘  │  1× D4s_v5 (4 vCPU, 16GB)        │  │
│                       │  Cost: ~$150/mo                   │  │
│  ┌─────────────────┐  └──────────────────────────────────┘  │
│  │  Cluster        │                                        │
│  │  Autoscaler     │  ┌──────────────────────────────────┐  │
│  └─────────────────┘  │  PR Node Pool (Autoscaled)       │  │
│                       │  0-4× D8s_v5 based on demand      │  │
│  ┌─────────────────┐  │  Cost: $0-770/mo (avg $347)      │  │
│  │  NAT + LB       │  └──────────────────────────────────┘  │
│  │  ($84/mo)       │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

#### Cost Breakdown

| Item | Type | Monthly Cost |
|------|------|--------------|
| AKS Control Plane | Fixed | $0 (free tier) |
| NAT Gateway (2× HA) | Fixed | $66 |
| Standard Load Balancer | Fixed | $18 |
| Managed Disk | Fixed | $30 |
| System Node Pool | Fixed | $150 |
| **Fixed Subtotal** | | **$264** |
| PR Nodes (at 45% avg) | Variable | $347 |
| **Total with Autoscaling** | | **$601/mo** |
| **Cost per PR** | | **$1.08** |

---

### 6.4 Oracle Cloud (OKE)

#### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Oracle Cloud OKE                        │
│  ┌─────────────────┐                                        │
│  │  OKE Control    │  ┌──────────────────────────────────┐  │
│  │  Plane (FREE)   │  │  System Node Pool (Fixed)        │  │
│  └─────────────────┘  │  VM.Standard.E4.Flex (4 OCPU)    │  │
│                       │  Cost: ~$150/mo                   │  │
│  ┌─────────────────┐  └──────────────────────────────────┘  │
│  │  Cluster        │                                        │
│  │  Autoscaler     │  ┌──────────────────────────────────┐  │
│  └─────────────────┘  │  PR Node Pool (Autoscaled)       │  │
│                       │  0-2× E4.Flex (8 OCPU) on demand  │  │
│  ┌─────────────────┐  │  Cost: $0-280/mo (avg $126)      │  │
│  │  NAT (FREE)     │  └──────────────────────────────────┘  │
│  │  LB ($10/mo)    │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

#### Cost Breakdown

| Item | Type | Monthly Cost |
|------|------|--------------|
| OKE Control Plane | Fixed | $0 |
| NAT Gateway | Fixed | $0 (included) |
| Flexible Load Balancer | Fixed | $10 |
| Block Storage | Fixed | $15 |
| System Node Pool | Fixed | $150 |
| **Fixed Subtotal** | | **$175** |
| PR Nodes (at 45% avg) | Variable | $126 |
| **Total with Autoscaling** | | **$301/mo** |
| **Cost per PR** | | **$0.54** |

#### Oracle Cloud Unique Advantages

| Feature | Oracle Cloud | Other Clouds |
|---------|--------------|--------------|
| **NAT Gateway** | Included in VCN | $66-73/mo |
| **Egress** | 10 TB/month FREE | $0.087-0.12/GB |
| **Control Plane** | FREE | $0-73/mo |
| **x86 Pricing** | $0.025/OCPU-hr | $0.04-0.05/vCPU-hr |

---

## 7. Hidden Costs Analysis

### 7.1 Costs Often Overlooked

| Cost Item | AWS | GCP | Azure | Oracle |
|-----------|-----|-----|-------|--------|
| **NAT Gateway (hourly)** | $66/mo | $64/mo | $66/mo | **FREE** |
| **NAT Data Processing** | $0.045/GB | $0.045/GB | $0.045/GB | **FREE** |
| **Egress (internet)** | $0.09/GB | $0.12/GB | $0.087/GB | **10TB FREE** |
| **Cross-AZ Transfer** | $0.01/GB | $0.01/GB | $0.01/GB | **FREE** |
| **Control Plane** | $73/mo | $0 | $0 | **FREE** |
| **Load Balancer (idle)** | $48/mo | $18/mo | $18/mo | $10/mo |

### 7.2 Impact on Total Cost

| Cloud | Compute Cost | Hidden/Fixed Costs | Total | Hidden % |
|-------|--------------|-------------------|-------|----------|
| AWS | $497 | $173 | $670 | 26% |
| GCP | $366 | $102 | $468 | 22% |
| Azure | $497 | $104 | $601 | 17% |
| Oracle | $276 | $25 | $301 | 8% |

**Oracle's minimal hidden costs are a significant competitive advantage.**

---

## 8. Capacity Planning

### 8.1 Scaling Scenarios (with Autoscaling)

| Monthly PRs | Concurrent (peak) | Oracle | GCP | Azure | AWS |
|-------------|-------------------|--------|-----|-------|-----|
| **200** | 15 | $220 | $350 | $450 | $520 |
| **400** | 30 | $270 | $420 | $540 | $610 |
| **557** | 40 | $301 | $468 | $601 | $670 |
| **800** | 60 | $380 | $580 | $750 | $850 |
| **1200** | 90 | $500 | $750 | $950 | $1,100 |

### 8.2 Cost per PR at Scale

| Monthly Throughput | Oracle | GCP | Azure | AWS |
|-------------------|--------|-----|-------|-----|
| 200 PRs | $1.10 | $1.75 | $2.25 | $2.60 |
| 400 PRs | $0.68 | $1.05 | $1.35 | $1.53 |
| **557 PRs** | **$0.54** | **$0.84** | **$1.08** | **$1.20** |
| 800 PRs | $0.48 | $0.73 | $0.94 | $1.06 |
| 1200 PRs | $0.42 | $0.63 | $0.79 | $0.92 |

**Economies of scale:** Cost per PR decreases as throughput increases because fixed costs are amortized over more PRs.

### 8.3 Break-Even Analysis

| Comparison | Notes |
|------------|-------|
| Oracle Free Tier → Oracle Paid | When exceeding 15-20 concurrent PRs |
| Oracle vs GCP | Oracle always cheaper (35% savings) |
| Oracle vs Azure | Oracle always cheaper (50% savings) |
| Oracle vs AWS | Oracle always cheaper (55% savings) |

---

## 9. Recommendations

### 9.1 Decision Matrix

| Factor | Weight | AWS | GCP | Azure | Oracle |
|--------|--------|-----|-----|-------|--------|
| **Cost Efficiency** | 35% | 2 | 3 | 2 | 5 |
| **Autoscaling Maturity** | 20% | 5 | 5 | 4 | 4 |
| **Multi-arch Support** | 15% | 5 | 2 | 3 | 4 |
| **Enterprise Features** | 10% | 5 | 4 | 5 | 3 |
| **Ease of Migration** | 10% | 4 | 4 | 4 | 5 |
| **Hidden Cost Transparency** | 10% | 2 | 3 | 3 | 5 |
| **Weighted Score** | 100% | 3.5 | 3.5 | 3.2 | **4.5** |

### 9.2 Primary Recommendation: Oracle Cloud OKE

| Reason | Details |
|--------|---------|
| **55% Cost Savings vs AWS** | $301 vs $670/month |
| **Lowest Cost per PR** | $0.54 vs $0.84-1.20 |
| **Free Networking** | NAT Gateway + 10TB egress included |
| **No Migration Complexity** | Already running on Oracle Cloud |
| **Good Autoscaling** | OKE Cluster Autoscaler supported |

### 9.3 Scaling Path

```
Current (Free Tier)     →     Paid with Autoscaling     →     Multi-Region
──────────────────────────────────────────────────────────────────────────
4 OCPU, 24GB                  System: 4 OCPU fixed           System: 8 OCPU
Single node k3s               PR Pool: 0-16 OCPU auto        PR Pool: 0-64 OCPU
10-15 concurrent PRs          40 concurrent PRs              100+ concurrent PRs
~200 PRs/month                ~557 PRs/month                 ~1500 PRs/month
$0/month                      $301/month                     $800+/month
```

### 9.4 Alternative Recommendations

**If GCP ecosystem integration is needed:**
- GKE Autopilot: $468/month, $0.84/PR
- Best serverless autoscaling

**If enterprise compliance is required:**
- AWS EKS with Karpenter: $670/month, $1.20/PR
- Most mature enterprise features

**If Azure ecosystem integration is needed:**
- AKS with Cluster Autoscaler: $601/month, $1.08/PR
- Good Azure DevOps integration

### 9.5 Implementation Checklist

| Task | Priority | Notes |
|------|----------|-------|
| Migrate to managed OKE | CRITICAL | Required for autoscaling |
| Configure Cluster Autoscaler | CRITICAL | Enable node autoscaling |
| Create system node pool | CRITICAL | Fixed resources for observability |
| Create PR node pool | CRITICAL | Autoscaled for PR workloads |
| Add resource requests to all pods | CRITICAL | Required for autoscaler decisions |
| Configure PodDisruptionBudgets | HIGH | Safe node drain |
| Set up pod priorities | HIGH | Protect system pods |
| Configure scale-down delay | MEDIUM | Avoid thrashing |
| Add node affinity rules | MEDIUM | Isolate workloads |

---

## 10. Sources

### Cloud Provider Pricing Pages

- [AWS EKS Pricing](https://aws.amazon.com/eks/pricing/)
- [AWS EC2 On-Demand Pricing](https://aws.amazon.com/ec2/pricing/on-demand/)
- [GCP GKE Pricing](https://cloud.google.com/kubernetes-engine/pricing)
- [GCP Compute Engine Pricing](https://cloud.google.com/compute/all-pricing)
- [Azure AKS Pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/)
- [Azure VM Pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/)
- [Oracle OKE Pricing](https://www.oracle.com/cloud/cloud-native/kubernetes-engine/pricing/)
- [Oracle Compute Pricing](https://www.oracle.com/cloud/compute/pricing/)

### Autoscaling Documentation

- [AWS Karpenter](https://karpenter.sh/)
- [GKE Autopilot](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview)
- [GKE Cluster Autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler)
- [AKS Cluster Autoscaler](https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler)
- [OKE Cluster Autoscaler](https://docs.oracle.com/en-us/iaas/Content/ContEng/Tasks/contengusingclusterautoscaler.htm)

### Networking Costs

- [AWS NAT Gateway Pricing](https://aws.amazon.com/vpc/pricing/)
- [GCP Cloud NAT Pricing](https://cloud.google.com/nat/pricing)
- [Azure NAT Gateway Pricing](https://azure.microsoft.com/en-us/pricing/details/azure-nat-gateway/)

### Instance Comparison Tools

- [Vantage EC2 Instance Comparison](https://instances.vantage.sh/)
- [CloudPrice Multi-Cloud Comparison](https://cloudprice.net/)

---

## Appendix A: Key Formulas

### A.1 PR Throughput

```
Monthly Throughput = Concurrent Slots × Days per Month / Avg PR Lifecycle
                   = 40 × 30 / 2.15
                   = 557 PRs/month
```

### A.2 Cost per PR

```
Cost per PR = Monthly Infrastructure Cost / Monthly PR Throughput
            = $301 / 557
            = $0.54 per PR
```

### A.3 Autoscaling Savings

```
Savings = (1 - Average Utilization) × Variable Compute Cost
        = (1 - 0.45) × $280
        = $154/month (55% savings on variable costs)
```

### A.4 Total Monthly Cost

```
Total = Fixed Costs + (Variable Costs × Average Utilization)
      = $175 + ($280 × 0.45)
      = $175 + $126
      = $301/month
```

---

## Appendix B: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2025 | Engineering Team | Initial analysis |
| 2.0 | January 2025 | Engineering Team | Added PR lifecycle model, autoscaling requirements, corrected cost per PR calculations |

---

*This document is for planning purposes only. Actual costs may vary based on region, usage patterns, and pricing changes. Always verify current pricing on provider websites before making decisions.*
