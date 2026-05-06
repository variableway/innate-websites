# AGENTS.md - AI Agent Context

This document provides context for AI agents working on the vYtDL codebase.

## Project Overview

vYtDL is a Go-based YouTube downloader CLI that wraps yt-dlp. It provides a user-friendly interface with TUI support, playlist management, and download tracking.

## Technology Stack

- **Language**: Go 1.24+
- **CLI Framework**: spf13/cobra
- **TUI Framework**: charmbracelet/bubbletea + lipgloss
- **External Dependency**: yt-dlp (Python-based, called as subprocess)

## Architecture

```
main.go → cmd.Execute() → cmd/root.go
                              ↓
                    cmd/download.go (flags parsing)
                              ↓
                    downloader.New() → yt-dlp subprocess
                              ↓
                    record.Manager → JSON/CSV output files
```

## Key Modules

### cmd/
- `root.go` - Cobra root command, application metadata
- `download.go` - All CLI flags, download orchestration, TUI coordination
- `download.go` now performs a preflight yt-dlp binary check before running downloads and returns OS-specific install hints when missing

### internal/config/
- Loads `config.json` for yt-dlp binary path
- Simple JSON unmarshaling, no complex validation

### internal/downloader/
- Core download logic, wraps yt-dlp as subprocess
- `Options` struct holds all download parameters
- `ProgressUpdate` channel feeds TUI
- Handles single video and playlist modes
- URL normalization (fixes escaped characters in URLs)

### internal/playliststate/
- Manages `.playlist_state.json` for resume capability
- States: `pending`, `running`, `succeeded`, `failed`
- Persists after each video download attempt

### internal/record/
- Manages `download_record.json/csv` and `subtitle_mapping.json/csv`
- Aggregates results, flushes at end of run

### internal/tui/
- bubbletea-based terminal UI
- Displays progress bars, status, errors

## Important Patterns

### Progress Channel Pattern
```go
progressCh := make(chan downloader.ProgressUpdate, 100)
go func() {
    for upd := range progressCh {
        // Handle progress updates
    }
}()
dl := downloader.New(opts, progressCh)
```

### yt-dlp Command Construction
Commands are built in `internal/downloader/downloader.go`. Key flags passed through:
- `--format`, `--quality` for video selection
- `--write-subs`, `--sub-langs` for subtitles
- `--download-sections` for time ranges
- `--proxy`, `--cookies`, `--user-agent` for network recovery

### Playlist Resume Logic
1. Fetch full playlist metadata first
2. Check `.playlist_state.json` in playlist directory
3. Skip already `succeeded` items
4. Update state after each download attempt
5. `--reset-playlist-state` flag clears saved state

## Common Tasks

### Adding a New CLI Flag
1. Add flag variable in `cmd/download.go` init()
2. Add to `downloader.Options` struct
3. Pass through to yt-dlp in `internal/downloader/downloader.go`

### Modifying Download Behavior
Edit `internal/downloader/downloader.go`:
- `DownloadSingle()` for single videos
- `DownloadPlaylist()` for collections

### Changing Output Format
Modify `internal/record/record.go` for record/mapping file changes.

## File Conventions

- Go files: standard Go formatting, no external formatters required
- Test files: `*_test.go` alongside source files
- JSON config: simple key-value, no nested structures

## Shell Scripts

Located in `vYtDL/scripts/`:
- `download_video.sh` - Single video wrapper
- `download_collection.sh` - Playlist wrapper
- `build.sh` - Cross-build helper for macOS/Linux/Windows targets
- `build.ps1` - Cross-build helper for macOS/Linux/Windows targets on PowerShell

Download wrapper scripts now validate `yt-dlp`/`youtube-dl` availability before calling `go run .`.

Both use `go run .` for development convenience.

## Known Issues

- yt-dlp must be installed separately and path configured in `config.json`
- YouTube may block anonymous requests; use `--cookies-from-browser` as workaround
- URL escaping issues were fixed; downloader normalizes input URLs
