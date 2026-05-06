# Innate Way — Project Map

This monorepo contains four projects, each serving a distinct purpose in the **personal AI assistant** ecosystem.

## Projects

### 1. `capture/` — Ideas Capture CLI (Python)

Terminal-based capture tool for quickly recording ideas, tasks, and notes. Organizes entries with categories, tags, and metadata. Supports AI-powered content analysis and auto-categorization.

- **Stack**: Python, Typer/Click CLI, Rich TUI, pytest
- **Role**: CLI input layer — the fastest way to capture thoughts from terminal
- **Status**: Functional

### 2. `capture-tui-go/` — Ideas Capture CLI (Go)

Go rewrite of the capture tool. Same core features — add ideas, manage categories, analyze content, export to CSV/JSON/Markdown. Includes session management for tracking AI conversations.

- **Stack**: Go, Cobra CLI, YAML storage, Ginkgo testing
- **Role**: Performance-oriented CLI alternative to the Python version
- **Status**: In development

### 3. `innate/` — AI Assistant Desktop + Web App

Full-featured AI assistant with desktop app (Tauri v2) and web app (Next.js). Monorepo with shared packages for UI, business logic, and views.

- **Stack**: Tauri v2 + Next.js 16 + React 19 + Rust + Vite + shadcn/ui + Tailwind v4
- **Packages**: `@innate/ui` (components), `@innate/core` (logic + Platform Bridge), `@innate/views` (shared pages)
- **Features**: Ideas inbox, task kanban, agent runtime, memory system, MCP tools, terminal, skills, Feishu integration
- **Role**: The main application — desktop + web frontend for the entire system
- **Status**: Scaffold complete, building features

### 4. `client/` — Innate Capture Desktop App

Cross-platform capture application (Tauri + Next.js) focused on note-taking and category management. Desktop-first with web support.

- **Stack**: Tauri 2.x + Next.js 16 + React 19 + shadcn/ui + TypeScript
- **Role**: Lightweight capture-focused desktop client
- **Status**: Functional

## Architecture Overview

```
User Input
    │
    ├── Terminal ──▶ capture/ (Python) or capture-tui-go/ (Go)
    │                      │
    │                      ▼
    ├── Desktop ───▶ client/ (Capture-only) or innate/ (Full AI Assistant)
    │                      │
    └── Browser ───▶ innate/ (Web version)
                           │
                           ├── Ideas → Tasks → Agent Execution
                           ├── Memory (cross-session persistence)
                           └── MCP Tools (Feishu, filesystem, etc.)
```

## Target Users

Individuals and small teams (≤10 people).
