# Tasks for US-035: CLI Tool

## Tasks

### T-035.1: Project Setup and CLI Skeleton
- **Description:** Initialize Go module and set up CLI structure with Cobra
- **Acceptance Criteria:**
  - Go module initialized with appropriate module path
  - Cobra CLI framework configured
  - Root command with version, help subcommands
  - Makefile for build, test, lint
  - GitHub Actions for CI (lint, test, build)
- **Estimate:** S
- **Files:** `cli/cmd/k8s-ee/`, `cli/go.mod`, `cli/Makefile`, `.github/workflows/cli.yml`

### T-035.2: Config Reader
- **Description:** Implement k8s-ee.yaml reader to get project context
- **Acceptance Criteria:**
  - Reads k8s-ee.yaml from current directory
  - Extracts projectId
  - Clear error if file not found or invalid
  - Supports `--config` flag to override path
- **Estimate:** S
- **Files:** `cli/internal/config/`

### T-035.3: API Client
- **Description:** Implement HTTP client for API communication
- **Acceptance Criteria:**
  - Base HTTP client with configurable API URL
  - Request/response types matching API contract
  - Error handling with user-friendly messages
  - Timeout and retry configuration
  - Mock mode for development without API
- **Estimate:** M
- **Files:** `cli/internal/api/`

### T-035.4: Auth Token Storage
- **Description:** Implement secure token storage
- **Acceptance Criteria:**
  - Store token in OS keychain (macOS Keychain, Windows Credential Manager, Linux Secret Service)
  - Fallback to file storage in `~/.config/k8s-ee/credentials`
  - Token refresh handling
  - Secure file permissions (0600)
- **Estimate:** M
- **Files:** `cli/internal/auth/storage.go`

### T-035.5: Auth Login Command
- **Description:** Implement GitHub OAuth device flow login
- **Acceptance Criteria:**
  - `k8s-ee auth login` starts device flow
  - Displays user code and verification URL
  - Opens browser automatically (with option to skip)
  - Polls for token completion
  - Stores token securely
  - Shows success message with username
- **Estimate:** M
- **Files:** `cli/cmd/k8s-ee/auth.go`, `cli/internal/auth/device_flow.go`

### T-035.6: Auth Status and Logout Commands
- **Description:** Implement auth status check and logout
- **Acceptance Criteria:**
  - `k8s-ee auth status` shows current user or "not logged in"
  - `k8s-ee auth logout` clears stored credentials
  - Both commands work offline (status checks stored token)
- **Estimate:** S
- **Files:** `cli/cmd/k8s-ee/auth.go`

### T-035.7: Env Set Command
- **Description:** Implement environment variable setting
- **Acceptance Criteria:**
  - `k8s-ee env set KEY=value` sets single variable
  - `k8s-ee env set K1=v1 K2=v2` sets multiple
  - `k8s-ee env set -f .env` reads from file
  - Validates KEY format (alphanumeric + underscore)
  - Shows confirmation of variables set
  - Shows count of PR namespaces updated
- **Estimate:** M
- **Files:** `cli/cmd/k8s-ee/env.go`

### T-035.8: Env List Command
- **Description:** Implement environment variable listing
- **Acceptance Criteria:**
  - `k8s-ee env list` shows all keys with masked values
  - Table format with KEY and VALUE columns
  - VALUE shows `********` by default
  - Empty state message if no variables
- **Estimate:** S
- **Files:** `cli/cmd/k8s-ee/env.go`

### T-035.9: Env Get and Delete Commands
- **Description:** Implement get and delete operations
- **Acceptance Criteria:**
  - `k8s-ee env get KEY` shows single value (with confirmation prompt)
  - `k8s-ee env delete KEY` removes variable
  - `k8s-ee env delete KEY --yes` skips confirmation
  - Error if KEY doesn't exist
- **Estimate:** S
- **Files:** `cli/cmd/k8s-ee/env.go`

### T-035.10: Terminal Output Formatting
- **Description:** Implement consistent terminal output
- **Acceptance Criteria:**
  - Colored output (success green, error red, info blue)
  - Respects `NO_COLOR` environment variable
  - Spinner for long operations
  - Table formatting for lists
  - JSON output with `--json` flag
- **Estimate:** S
- **Files:** `cli/internal/output/`

### T-035.11: Cross-Platform Build and Release
- **Description:** Set up release automation
- **Acceptance Criteria:**
  - GoReleaser configuration
  - Builds for darwin/linux/windows, amd64/arm64
  - GitHub Release on tag push
  - Homebrew formula generation
  - Checksums and signatures
- **Estimate:** M
- **Files:** `.goreleaser.yml`, `.github/workflows/release-cli.yml`

### T-035.12: Documentation
- **Description:** Write CLI documentation
- **Acceptance Criteria:**
  - README with installation instructions
  - Command reference with examples
  - Troubleshooting section
  - Update main docs to reference CLI
- **Estimate:** S
- **Files:** `cli/README.md`, `docs/guides/cli.md`

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
