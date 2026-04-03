"use client"

import Link from "next/link"
import { 
  CheckSquare, 
  Calendar, 
  ArrowRight, 
  ChevronRight,
  Hammer,
  Circle,
  TrendingUp,
  Sparkles
} from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Badge,
  Button,
  cn
} from "@allone/ui"
import { 
  getLatestIssues, 
  getLatestWeeklies,
  projects 
} from "@/lib/making/data"
import type { Issue, WeeklySummary } from "@/lib/making/types"

export default function HomePage() {
  const latestWeeklies = getLatestWeeklies(4)
  const latestIssues = getLatestIssues(4)

  return (
    <div className="min-h-full bg-background">
      {/* Hero Section */}
      <section className="px-6 pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Hammer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Making</h1>
              <p className="text-sm text-muted-foreground">
                Track progress, reflect weekly, grow continuously
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Weekly Section - First */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold">周记录</h2>
                <Badge variant="secondary" className="text-xs">Latest</Badge>
              </div>
              <Link 
                href="/making/weekly"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                View all
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestWeeklies.map((weekly) => (
                <WeeklyPreviewCard key={weekly.id} weekly={weekly} />
              ))}
            </div>
          </div>

          {/* Issues Section - Second */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <h2 className="text-base font-semibold">做什么</h2>
                <Badge variant="secondary" className="text-xs">Recent</Badge>
              </div>
              <Link 
                href="/making/issues"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                View all
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestIssues.map((issue) => (
                <IssuePreviewCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function WeeklyPreviewCard({ weekly }: { weekly: WeeklySummary }) {
  return (
    <Link href={`/making/weekly/${weekly.id}`}>
      <Card className="group h-full hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Week {weekly.weekNumber}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatShortDate(weekly.dateRange.start)}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <CardTitle className="text-sm font-medium mt-2 group-hover:text-primary transition-colors line-clamp-1">
            {weekly.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {weekly.summary}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>{weekly.evaluations.strengths.length} strengths</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-purple-500" />
              <span>{weekly.mindsetAnalysis.strengths.length} mindset</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function IssuePreviewCard({ issue }: { issue: Issue }) {
  const project = projects.find(p => p.id === issue.project)
  
  return (
    <Link href="/making/issues">
      <Card className="group h-full hover:shadow-md transition-all cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {issue.status === 'closed' ? (
                <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckSquare className="h-2.5 w-2.5 text-green-500" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center shrink-0">
                  <Circle className="h-1.5 w-1.5 text-muted-foreground" />
                </div>
              )}
              <span className="text-xs text-muted-foreground font-mono">
                #{issue.number}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div 
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: project?.color || '#888' }}
              />
              <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                {project?.name || issue.project}
              </span>
            </div>
          </div>
          <CardTitle className="text-sm font-medium mt-2 line-clamp-1 group-hover:text-primary transition-colors">
            {issue.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {issue.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {issue.labels.slice(0, 2).map(label => (
              <Badge 
                key={label.id}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
                style={{ 
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                }}
              >
                {label.name}
              </Badge>
            ))}
            {issue.labels.length > 2 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{issue.labels.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
