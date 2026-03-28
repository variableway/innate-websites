// Layout configuration for different pages

export type LayoutType = "complex" | "simple"

export interface PageLayoutConfig {
  layout: LayoutType
  showLeftBar: boolean
  showSidebar: boolean
  showHeader: boolean
  headerVariant?: "full" | "simple"
  sidebarVariant?: "channels" | "course-categories" | "course-sections" | "none"
}

// Page-specific layout configuration
export const pageLayoutConfig: Record<string, PageLayoutConfig> = {
  // Complex layout pages (LeftBar + Sidebar + Header)
  "/": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: true,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
  "/deep-news": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: true,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
  "/learning-library": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: true,
    headerVariant: "full",
    sidebarVariant: "course-categories",
  },
  "/course": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: true,
    headerVariant: "full",
    sidebarVariant: "course-sections",
  },
  "/ai-coding": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: true,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
  "/feed": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: true,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
  "/log": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: true,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
  "/events": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: true,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
  
  // Default fallback
  default: {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: true,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
}

// Get layout config for a pathname
export function getLayoutConfig(pathname: string): PageLayoutConfig {
  // Check exact match first
  if (pageLayoutConfig[pathname]) {
    return pageLayoutConfig[pathname]
  }
  
  // Check parent routes (for dynamic routes like /course/[id])
  for (const [route, config] of Object.entries(pageLayoutConfig)) {
    if (route !== "default" && pathname.startsWith(route + "/")) {
      return config
    }
  }
  
  return pageLayoutConfig.default
}
