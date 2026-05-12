# AI Agent Context

This file provides context for AI assistants working with this codebase.

## Project Overview

**Innate** is a Next.js monorepo containing a comprehensive UI component library and shared utilities. It uses pnpm workspaces for package management.

## Architecture

### Monorepo Structure
- **apps/**: Application projects (Next.js apps)
- **packages/ui**: `@innate/ui` - React component library (Base UI primitives via shadcn/ui)
- **packages/utils**: `@innate/utils` - Utility functions
- **packages/tsconfig**: `@innate/tsconfig` - Shared TypeScript configs

### Key Technologies
- **React 19** with **Next.js**
- **TypeScript 6**
- **pnpm** workspaces (v10.33.1)
- **Tailwind CSS v4** for styling
- **Base UI** (`@base-ui/react`) for accessible component primitives

## Important Patterns

### UI Component Pattern
All UI components in `packages/ui/src/components/ui/` follow these conventions:
- Built on **Base UI** primitives (not Radix UI) for accessibility
- Styled with Tailwind CSS
- Use `class-variance-authority` for variants
- Use relative imports within the package (e.g., `from "./button"`)
- Exported from `packages/ui/src/index.ts`
- No `asChild` prop — Base UI triggers render their own elements

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
1. Run: `cd packages/ui && npx shadcn@latest add <name> --overwrite --path src/components/ui`
2. Fix any subpath imports (`@innate/ui/*`) to relative imports (`./<name>`)
3. Export from `packages/ui/src/index.ts`

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
- **Forms**: Button, ButtonGroup, Input, InputGroup, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Form (react-hook-form integration), Field, Combobox
- **Layout**: Card, Dialog, Sheet, Sidebar, Tabs, Accordion, Collapsible, Resizable, Separator
- **Navigation**: Breadcrumb, NavigationMenu, Pagination, Menubar, DropdownMenu, ContextMenu
- **Data Display**: Table, Badge, Avatar, Progress, Skeleton, Chart (recharts), Calendar, Carousel, Pagination
- **Feedback**: Alert, AlertDialog, Toast, Sonner, Spinner, Empty, Tooltip, HoverCard
- **Overlay**: Popover, Tooltip, HoverCard, Command, Drawer
- **Utility**: ScrollArea, Kbd, Label, AspectRatio, Item, NativeSelect, Direction

### Styling Approach
- Tailwind CSS utility classes
- Dark mode support via next-themes
- OKLCH color space CSS variables in `packages/ui/src/globals.css`
- shadcn/ui `base-vega` style preset

## Dependencies of Note

- `@base-ui/react` - Accessible UI primitives (replaces Radix UI)
- `lucide-react` - Icon library
- `recharts` - Chart library
- `react-hook-form` + `@hookform/resolvers` + `zod` - Form handling
- `next-themes` - Theme management
- `sonner` + custom Toast - Notification systems
- `vaul` - Drawer component
- `cmdk` - Command menu

## Notes

- Private monorepo (not published to npm)
- React 19 peer dependency
- TypeScript strict mode enabled
- Both apps use static export (`output: "export"`)
