import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllCheatsheets, getCheatsheetBySlug } from "@/lib/cheatsheets/data"
import { extractToc } from "@/lib/content/parser"
import { CheatsheetDetailClient } from "@/components/cheatsheets/cheatsheet-detail-client"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const cheatsheets = await getAllCheatsheets()
  return cheatsheets.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cheatsheet = await getCheatsheetBySlug(slug)
  if (!cheatsheet) return {}

  return {
    title: `${cheatsheet.title} - Cheatsheets | Innate`,
    description: cheatsheet.description,
  }
}

export default async function CheatsheetDetailPage({ params }: Props) {
  const { slug } = await params
  const cheatsheet = await getCheatsheetBySlug(slug)

  if (!cheatsheet) {
    notFound()
  }

  const toc = extractToc(cheatsheet.content)

  return <CheatsheetDetailClient cheatsheet={cheatsheet} toc={toc} />
}
