# Tasks for US-007: Comment on PR with Preview URL

## Tasks

### T-007.1: Create PR Comment Template
- **Description:** Design the comment format with all required info
- **Acceptance Criteria:**
  - Template includes preview URL
  - Template includes Grafana link (optional)
  - Template includes deployment status
  - Template includes timestamp
  - Markdown formatted nicely
- **Estimate:** XS

### T-007.2: Implement Comment Action Step
- **Description:** Add workflow step to post/update PR comment
- **Acceptance Criteria:**
  - Uses `github-script` or `peter-evans/create-or-update-comment`
  - Finds existing bot comment and updates it
  - Creates new comment if none exists
  - Handles PR number correctly
- **Estimate:** S

### T-007.3: Handle Deployment Failure Comment
- **Description:** Update comment on deployment failure
- **Acceptance Criteria:**
  - Comment updated to show failure status
  - Error message included (if safe)
  - Link to workflow logs included
- **Estimate:** S

### T-007.4: Test Comment Updates
- **Description:** Verify comment behavior across scenarios
- **Acceptance Criteria:**
  - First deploy creates comment
  - Re-deploy updates same comment
  - Failed deploy shows error status
  - Multiple PRs get separate comments
- **Estimate:** S

---

## Estimate Legend
- **XS:** < 1 hour
- **S:** 1-4 hours
- **M:** 4-8 hours (1 day)
- **L:** 2-3 days
- **XL:** 4-5 days
