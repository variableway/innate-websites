import { notFound } from "next/navigation"
import { getTutorialBySlug, getAllTutorials } from "@/lib/tutorials-server"
import { getDifficultyLabel, getDifficultyColor } from "@/lib/tutorials"
import { TutorialContent } from "@/components/tutorials/tutorial-content"
import { TableOfContents } from "@/components/table-of-contents"
import { extractToc } from "@/lib/content/parser"
import { ArrowLeft, Clock, Wrench } from "lucide-react"
import Link from "next/link"
import { cn } from "@allone/utils"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const tutorials = await getAllTutorials()
  return tutorials.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tutorial = await getTutorialBySlug(slug)
  if (!tutorial) return {}
  
  return {
    title: `${tutorial.title} - Innate Tutorials`,
    description: tutorial.description,
  }
}

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params
  const tutorial = await getTutorialBySlug(slug)

  if (!tutorial) {
    notFound()
  }

  const toc = extractToc(tutorial.content)

  return (
    <div className="min-h-full bg-background flex">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回教程列表
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_200px] gap-8">
            <div>
              {/* Meta */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    getDifficultyColor(tutorial.difficulty)
                  )}>
                    {getDifficultyLabel(tutorial.difficulty)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {tutorial.time}
                  </span>
                  {tutorial.tool && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Wrench className="w-4 h-4" />
                      {tutorial.tool}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {tutorial.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {tutorial.description}
                </p>
              </div>

              {/* Content */}
              <TutorialContent content={tutorial.content} />
            </div>

            {/* Sidebar - Table of Contents */}
            <aside className="hidden xl:block">
              <TableOfContents headings={toc} />
            </aside>
          </div>
        </article>

        {/* Footer */}
        <div className="border-t border-border mt-16">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground text-sm">
              what drives you and what you make, makes you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
