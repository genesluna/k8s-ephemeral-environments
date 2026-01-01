# US-034: Organization Allowlist

**Status:** Done

## User Story

**As a** platform administrator,
**I want** to restrict which organizations and users can create ephemeral environments,
**So that** only authorized teams can consume cluster resources.

## Acceptance Criteria

- [x] Allowlist configuration file at `.github/config/allowed-orgs.json`
- [x] Validation fails early with clear error message for unauthorized orgs
- [x] Supports both organizations and individual users
- [x] Case-insensitive matching
- [x] Optional specific repository overrides
- [x] Documentation explains how to request access

## Priority

**Must** - Critical for multi-tenant security

## Story Points

**Story Points:** 3

## Dependencies

- US-031: Reusable Workflow

## Notes

- File-based config provides audit trail via git history
- Empty allowlist denies all access (fail-safe)
- Backwards compatible: missing config file allows all (with warning)

## Implementation

- **Configuration:** `.github/config/allowed-orgs.json`
  - `mode`: `allowlist`, `denylist`, or `disabled`
  - `organizations`: Array of allowed org/user names
  - `repositories`: Optional specific repo overrides

- **Validation:** `.github/actions/validate-config/action.yml`
  - New step after "Validate inputs"
  - Extracts org from repository input
  - Checks against allowlist (case-insensitive)
  - Fails with clear error message if unauthorized

- **Documentation:**
  - `docs/guides/access-control.md` - Access control system
  - Updated `docs/guides/onboarding-new-repo.md` - Prerequisites section
  - Updated `docs/guides/troubleshooting.md` - Authorization error entry
