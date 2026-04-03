# AI Agent Context

This file provides context for AI assistants working with this codebase.

## Project Overview

**Innate** is a Next.js monorepo containing a comprehensive UI component library and shared utilities. It uses pnpm workspaces for package management.

## Architecture

### Monorepo Structure
- **apps/**: Application projects (Next.js apps)
- **packages/ui**: `@innate/ui` - React component library
- **packages/utils**: `@innate/utils` - Utility functions
- **packages/tsconfig**: `@innate/tsconfig` - Shared TypeScript configs

### Key Technologies
- **React 19** with **Next.js**
- **TypeScript 6**
- **pnpm** workspaces (v10.32.1)
- **Tailwind CSS** for styling
- **Radix UI** for accessible component primitives

## Important Patterns

### UI Component Pattern
All UI components in `packages/ui/src/components/ui/` follow these conventions:
- Built on Radix UI primitives for accessibility
- Styled with Tailwind CSS
- Use `class-variance-authority` for variants
- Exported from `packages/ui/src/index.ts`

### className Merging
Use the `cn()` utility for merging classNames:
```tsx
import { cn } from '@innate/ui'
// or
import { cn } from '@innate/utils'
```

### TypeScript Configuration
Shared configs are available via:
```json
{
  "extends": "@innate/tsconfig/nextjs.json"
}
```

## Common Tasks

### Adding a New UI Component
1. Create file in `packages/ui/src/components/ui/`
2. Use Radix UI primitives
3. Export from `packages/ui/src/index.ts`
4. Follow existing component patterns (button.tsx, card.tsx as examples)

### Creating a New App
1. Create directory in `apps/`
2. Reference in root `tsconfig.json`
3. Run with `./run.sh <app-name> dev`

### Running Commands
- `pnpm dev` - Start main web app
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `./run.sh <project> <command>` - Run project-specific commands

## Component Library Details

### Available Categories
- **Forms**: Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Form (react-hook-form integration)
- **Layout**: Card, Dialog, Sheet, Sidebar, Tabs, Accordion, Collapsible, Resizable
- **Navigation**: Breadcrumb, NavigationMenu, Pagination, Menubar
- **Data Display**: Table, Badge, Avatar, Progress, Skeleton, Chart (recharts)
- **Feedback**: Alert, Toast, Sonner, Spinner, Empty
- **Overlay**: Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, AlertDialog
- **Utility**: ScrollArea, Separator, AspectRatio, Kbd, Label

### Styling Approach
- Tailwind CSS utility classes
- Dark mode support via next-themes
- Global styles in `packages/ui/src/globals.css`

## Dependencies of Note

- `@radix-ui/*` - Accessible UI primitives
- `lucide-react` - Icon library
- `recharts` - Chart library
- `react-hook-form` + `@hookform/resolvers` + `zod` - Form handling
- `next-themes` - Theme management
- `sonner` + custom Toast - Notification systems

## Notes

- Private monorepo (not published to npm)
- React 19 peer dependency
- TypeScript strict mode enabled
