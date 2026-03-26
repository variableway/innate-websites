# Innate - Next.js Monorepo

A modern monorepo built with Next.js, featuring a comprehensive UI component library and shared utilities.

## Project Structure

```
innate-next-mono/
├── apps/                    # Application projects
├── packages/
│   ├── ui/                  # Shared UI component library
│   ├── utils/               # Shared utility functions
│   └── tsconfig/            # Shared TypeScript configurations
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── tsconfig.json            # Root TypeScript config (project references)
```

## Packages

### @innate/ui
A comprehensive React UI component library built with:
- **Radix UI** - Accessible, unstyled component primitives
- **Tailwind CSS** - Utility-first styling
- **class-variance-authority** - Component variant management
- **lucide-react** - Beautiful icons

**Components included (50+):**
- Form controls: Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider
- Layout: Card, Dialog, Sheet, Sidebar, Tabs, Accordion, Collapsible
- Navigation: Breadcrumb, Navigation Menu, Pagination, Menubar
- Data Display: Table, Badge, Avatar, Progress, Skeleton, Chart
- Feedback: Alert, Toast, Sonner, Spinner
- Overlay: Popover, Tooltip, Hover Card, Dropdown Menu, Context Menu
- And more...

### @innate/utils
Shared utility functions including:
- `cn()` - className merging utility using clsx and tailwind-merge

### @innate/tsconfig
Shared TypeScript configurations for:
- Base TypeScript settings
- Next.js projects
- React library projects

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.32.1 or higher)

## Installation

```bash
pnpm install
```

## Available Scripts

### Root Level
```bash
pnpm dev              # Start development server (runs @innate/web)
pnpm run:project      # Run project-specific commands (see run.sh)
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm clean            # Clean all build artifacts and node_modules
```

### Running Specific Projects
```bash
./run.sh <project-name> [command]

# Examples:
./run.sh pytopia-website-clone dev
./run.sh cms-website-clone build
```

## Technology Stack

- **Framework:** Next.js with React 19
- **Language:** TypeScript 6
- **Package Manager:** pnpm with workspaces
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Theme:** next-themes for dark mode support

## Usage

### Importing UI Components
```tsx
import { Button, Card, Dialog } from '@innate/ui'
import '@innate/ui/globals.css'
```

### Importing Utilities
```tsx
import { cn } from '@innate/utils'
```

## Development

Each package can be developed independently:

```bash
cd packages/ui
pnpm lint
```

## License

Private project
