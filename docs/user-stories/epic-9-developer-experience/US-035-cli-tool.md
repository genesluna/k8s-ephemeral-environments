# US-035: CLI Tool

## User Story

**As a** developer,
**I want** a command-line tool to manage environment variables for my project,
**So that** I can easily configure secrets without dealing with sealed secrets or manual GitHub secrets management.

## Acceptance Criteria

- [ ] CLI binary named `k8s-ee` available for macOS, Linux, and Windows (amd64/arm64)
- [ ] `k8s-ee auth login` authenticates via GitHub OAuth device flow
- [ ] `k8s-ee auth logout` clears stored credentials
- [ ] `k8s-ee auth status` shows current authenticated user
- [ ] `k8s-ee env set KEY=value` sets one or more environment variables
- [ ] `k8s-ee env set -f .env` imports variables from a file
- [ ] `k8s-ee env list` shows all keys (values masked)
- [ ] `k8s-ee env get KEY` retrieves a single value
- [ ] `k8s-ee env delete KEY` removes an environment variable
- [ ] CLI reads `k8s-ee.yaml` to determine project-id
- [ ] Clear error messages for auth failures and API errors
- [ ] Installation via GitHub releases and homebrew

## Priority

**Should** - Improves developer experience significantly

## Story Points

8

## Dependencies

- US-059: Environment Variables API Service (required for full functionality)

## Notes

- CLI built in Go for cross-platform single-binary distribution
- Uses GitHub OAuth device flow (no browser redirect, works in terminals)
- Stores auth token in OS keychain or `~/.config/k8s-ee/`
- CLI can be developed against mock API initially
- Project context determined from `k8s-ee.yaml` in current directory
- Secrets are stored per-project, not per-PR (apply to all PRs automatically)

## Technical Design

### Authentication Flow

```
$ k8s-ee auth login
! First, copy your one-time code: ABCD-1234
- Press Enter to open github.com in your browser...
✓ Authentication complete. Logged in as genes
```

### CLI Structure

```
k8s-ee/
├── cmd/
│   └── k8s-ee/
│       ├── main.go
│       ├── auth.go        # auth login/logout/status
│       ├── env.go         # env set/list/get/delete
│       └── version.go     # version command
├── internal/
│   ├── config/            # Read k8s-ee.yaml
│   ├── api/               # HTTP client for API
│   ├── auth/              # GitHub OAuth + token storage
│   └── output/            # Terminal formatting
├── go.mod
└── go.sum
```

### Configuration

CLI reads project-id from `k8s-ee.yaml`:

```yaml
projectId: my-app
# ... rest of config
```

### API Contract

The CLI expects these endpoints from US-059:

```
POST /auth/device/code     # Get device code for OAuth
POST /auth/device/token    # Exchange code for token
GET  /projects/:id/env     # List env vars
PUT  /projects/:id/env     # Set env vars
DELETE /projects/:id/env/:key  # Delete env var
```
