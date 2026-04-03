# Making Module Data

This directory contains the data files for the Making module (Issues and Weekly Summaries).

## Files

- `issues.json` - GitHub issues data fetched from organization repositories
- `weekly.json` - AI-generated weekly summaries and analysis
- `sync-state.json` - Tracks the last sync state for incremental updates

## Data Structure

### issues.json

```json
{
  "projects": [
    {
      "id": "repo-name",
      "name": "Repo Name",
      "description": "Project description",
      "color": "#8FA68E",
      "repoUrl": "https://github.com/org/repo"
    }
  ],
  "issues": [
    {
      "id": "issue-123456",
      "number": 1,
      "title": "Issue title",
      "description": "Issue description",
      "status": "open|closed",
      "project": "repo-name",
      "labels": [
        {
          "id": "label-id",
          "name": "label-name",
          "color": "#22c55e",
          "description": "Label description"
        }
      ],
      "createdAt": "2026-04-01T00:00:00Z",
      "updatedAt": "2026-04-01T00:00:00Z",
      "closedAt": "2026-04-01T00:00:00Z",
      "url": "https://github.com/org/repo/issues/1",
      "author": "username"
    }
  ],
  "lastUpdated": "2026-04-01T00:00:00Z"
}
```

### weekly.json

```json
{
  "summaries": [
    {
      "id": "weekly-14-2026",
      "weekNumber": 14,
      "year": 2026,
      "title": "Week 14: Development Progress",
      "dateRange": {
        "start": "2026-03-30",
        "end": "2026-04-05"
      },
      "summary": "Weekly summary text...",
      "completedIssues": ["issue-123456"],
      "evaluations": {
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "improvements": ["Suggestion 1", "Suggestion 2"]
      },
      "mindsetAnalysis": {
        "strengths": ["Thinking strength 1"],
        "weaknesses": ["Pattern to watch 1"],
        "suggestions": ["Growth suggestion 1"]
      },
      "createdAt": "2026-04-06T00:00:00Z",
      "updatedAt": "2026-04-06T00:00:00Z"
    }
  ],
  "lastUpdated": "2026-04-01T00:00:00Z"
}
```

## Automation

The data is automatically updated via GitHub Actions:

1. **Fetch Issues** (`.github/workflows/fetch-issues.yml`)
   - Runs hourly or on-demand
   - Fetches all issues from organization repositories
   - Excludes `.github` repository
   - Only commits when there are new issues

2. **Generate Weekly Summary** (part of fetch workflow)
   - Analyzes closed issues from the current week
   - Generates AI evaluation and mindset analysis
   - Creates weekly summary with strengths, weaknesses, and suggestions

3. **Deploy to GitHub Pages** (`.github/workflows/deploy-pages.yml`)
   - Builds static site on every push to main
   - Deploys to GitHub Pages

## Manual Scripts

You can also run the scripts manually:

```bash
# Fetch issues from GitHub
cd apps/web
node scripts/fetch-issues.js

# Generate weekly summary
node scripts/generate-weekly.js

# Force regenerate weekly summary
node scripts/generate-weekly.js --force
```

## Environment Variables

- `GITHUB_TOKEN` - GitHub personal access token (for API requests)
- `GITHUB_ORG` - Organization name to fetch issues from
- `GITHUB_PAGES` - Set to 'true' for GitHub Pages builds
- `GITHUB_REPOSITORY` - Repository name for base path configuration
