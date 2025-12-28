# US-003: Configure Wildcard DNS

## User Story

**As an** SRE/DevOps engineer,
**I want** wildcard DNS configured for the preview domain,
**So that** PR environments are automatically accessible via unique URLs.

## Acceptance Criteria

- [ ] Wildcard A record created: `*.preview.domain.com` → VPS IP
- [ ] DNS propagation verified
- [ ] Test subdomain resolves correctly (e.g., test.preview.domain.com)
- [ ] TLS certificate strategy defined (Let's Encrypt wildcard or per-ingress)

## Priority

**Must** - Critical for MVP

## Story Points

2

## Dependencies

- US-001: Provision VPS Server

## Notes

- Wildcard DNS avoids creating individual records per PR
- Consider using cert-manager for automated TLS
- Alternative: use nip.io for zero-config DNS (e.g., app-pr-123.192.168.1.1.nip.io)
