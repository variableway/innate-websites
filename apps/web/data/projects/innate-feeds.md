# Agents.md — Innate Feeds

## Project Identity

**innate-feeds** is a full-stack trending content aggregator platform that collects and presents data from GitHub Trending, GitHub Starred Repos, and Product Hunt. It offers multiple interfaces: REST API, CLI tool, TUI dashboard, web application, and native desktop app.

---

## Repository Structure

```
innate-feeds/
├── trending-backend/                 # Go backend (Gin + GORM + Cobra + Bubble Tea)
│   ├── cmd/api/main.go               # REST API server entry
│   ├── cmd/cli/main.go               # CLI tool entry
│   ├── cmd/tui/main.go               # TUI dashboard entry
│   ├── internal/api/                 # handlers, middleware, router, Swagger docs
│   ├── internal/cli/                 # Cobra commands: fetch, list, serve, config
│   ├── internal/config/              # Env-based configuration
│   ├── internal/db/                  # GORM DB connection
│   ├── internal/models/              # GORM models (GitHubTrending, GitHubStarred, ProductHunt)
│   ├── internal/services/            # GitHub & ProductHunt business logic + interfaces
│   ├── internal/tui/                 # Bubble Tea TUI components
│   ├── pkg/github/client.go          # GitHub API client
│   ├── pkg/producthunt/client.go     # Product Hunt API client
│   ├── .env.example
│   ├── Dockerfile
│   ├── Makefile
│   └── go.mod
│
├── trending-web/                     # React 19 + Vite frontend
│   ├── src/App.tsx                   # Router: /, /github-trending, /github-starred, /product-hunt, /settings
│   ├── src/pages/                    # Dashboard, GitHubTrending, GitHubStarred, ProductHunt, Settings
│   ├── src/components/               # UI components (shadcn/ui) + DataTable, Footer, Navbar, etc.
│   ├── src/hooks/                    # useTrending, useStarred, useProductHunt, useStats, useI18n
│   ├── src/i18n/                     # en.ts, zh.ts (i18n support)
│   ├── src/lib/                      # api.ts, mock.ts, utils.ts
│   ├── src/types/index.ts
│   ├── scripts/fetch-data.js         # Data fetch script
│   ├── .github/workflows/            # CI: daily data update
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   └── package.json
│
├── trending-desktop/                 # Tauri v2 desktop wrapper
│   ├── src-tauri/src/                # lib.rs, main.rs
│   ├── src-tauri/tauri.conf.json
│   ├── src-tauri/Cargo.toml
│   └── scripts/generate-icons.sh
│
├── data/                             # JSON data exports
│   ├── starred_repos.json
│   ├── trending_daily.json
│   ├── trending_weekly.json
│   └── trending_monthly.json
│
├── docker-compose.yml                # PostgreSQL + backend + frontend
├── SPEC.md                           # Full system specification
├── plan.md                           # Implementation plan
├── DATA_REFRESH_SOLUTION.md          # Data refresh strategy (zh-CN)
├── .env.example                      # GITHUB_TOKEN + PRODUCTHUNT_TOKEN
├── README.md
└── AGENTS.md
```

---

## Backend (`trending-backend/`)

**Framework**: Gin (Go web framework) + GORM ORM
**Database**: SQLite (default) or PostgreSQL
**Three interfaces**:
- REST API (`cmd/api`): Gin server on `:8080`
- CLI tool (`cmd/cli`): Cobra commands for `fetch`, `list`, `serve`, `config`
- TUI dashboard (`cmd/tui`): Bubble Tea interactive terminal UI

**Services**: `internal/services/` — GitHub service (trending scraper + API), ProductHunt service
**API**: `http://localhost:8080/api/v1/` with Swagger at `/swagger/index.html`
**Scheduler**: Auto-fetch via gocron (configurable interval)

### Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/stats` | Dashboard statistics |
| GET | `/api/v1/github/trending` | List trending repos |
| POST | `/api/v1/github/trending/fetch` | Fetch trending repos |
| GET | `/api/v1/github/starred/:username` | List user's starred repos |
| POST | `/api/v1/github/starred/fetch` | Fetch starred repos |
| GET | `/api/v1/producthunt/trending` | List trending products |
| POST | `/api/v1/producthunt/fetch` | Fetch Product Hunt data |
| GET | `/swagger/index.html` | Swagger UI |

---

## Frontend (`trending-web/`)

**Framework**: React 19 + Vite + TypeScript + Tailwind CSS
**UI**: shadcn/ui (40+ components) + Recharts + Framer Motion
**Data fetching**: TanStack Query (React Query v5)
**i18n**: English + Chinese (zh-CN)

### Pages
| Route | Page |
|---|---|
| `/` | Dashboard with summary statistics |
| `/github-trending` | GitHub trending repos (daily/weekly/monthly) |
| `/github-starred` | GitHub user starred repos explorer |
| `/product-hunt` | Product Hunt trending products |
| `/settings` | API URL, theme, refresh settings |

---

## Desktop (`trending-desktop/`)

**Framework**: Tauri v2 (Rust) — wraps the web frontend
**Features**: System tray, native menus, keyboard shortcuts, cross-platform (Windows, macOS, Linux)

---

## Development Conventions

### Go
- **Stdlib logging**: Use `log` or `slog` (stdlib), not third-party loggers
- **Error handling**: Return errors up the stack, wrap with `fmt.Errorf`
- **GORM**: Models in `internal/models/`, DB connection in `internal/db/`
- **CLI**: Cobra commands in `internal/cli/`, each as separate file
- **TUI**: Bubble Tea components in `internal/tui/`, each tab as separate file
- **API**: Gin handlers in `internal/api/`, routes defined in `router.go`

### TypeScript / React
- **Framework**: Vite SPA with react-router, no SSR
- **UI components**: shadcn/ui patterns — use `cn()` from `clsx` + `tailwind-merge`
- **API calls**: Axios-based client in `lib/api.ts`
- **Data fetching**: TanStack Query hooks in `hooks/`
- **i18n**: Translation files in `i18n/`, consumed via `useI18n` hook

### Shared Patterns
- **Environment vars**: `.env` files at project roots, `.env.example` templates provided
- **GitHub Token**: `GITHUB_TOKEN` env var for higher API rate limits (5000 vs 60 req/hr)
- **No authentication required**: API is currently unauthenticated for local use

---

## Common Commands

```bash
# Backend
cd trending-backend
cp .env.example .env
go run ./cmd/api                              # Start API server (port 8080)
go run ./cmd/cli fetch github-trending --period daily
go run ./cmd/cli list github-starred <username>
go run ./cmd/tui                              # Launch TUI

# Web Frontend
cd trending-web
npm install
npm run dev                                   # Vite dev server
npm run build && npm run preview              # Production build

# Desktop
cd trending-desktop/src-tauri
cargo tauri dev
cargo tauri build

# Docker
GITHUB_TOKEN=xxx PRODUCTHUNT_TOKEN=xxx docker-compose up -d
# Frontend: http://localhost | API: http://localhost:8080
```

---

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | — | GitHub PAT for higher rate limits |
| `PRODUCTHUNT_TOKEN` | — | Product Hunt API developer token |
| `DB_DRIVER` | `sqlite` | `sqlite` or `postgres` |
| `DB_NAME` | `trending.db` | Database name/file |
| `API_PORT` | `8080` | API server port |
| `FETCH_INTERVAL` | `3600` | Auto-fetch interval (seconds) |

---

## When Making Changes

1. **Backend changes**: Go to `trending-backend/`, follow Go conventions above
2. **Frontend changes**: Go to `trending-web/`, follow React conventions above
3. **Desktop changes**: Go to `trending-desktop/`, work with Tauri v2 Rust code
4. **Docker**: Update `docker-compose.yml` at repo root
5. **Docs**: Update `README.md`, `SPEC.md`, or this file as needed
