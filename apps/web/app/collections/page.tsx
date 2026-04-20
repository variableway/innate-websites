import { Metadata } from "next"
import { CollectionsPageClient } from "@/components/collections/collections-page-client"
import { getAllCollections, getUniqueCategories, getUniqueTags, getUniqueSources } from "@/lib/collections/data"

export const metadata: Metadata = {
  title: "Collections | Innate",
  description: "Random ideas and experiments from AI agents.",
}

export default async function CollectionsPage() {
  const collections = getAllCollections()
  const categories = getUniqueCategories()
  const tags = getUniqueTags()
  const sources = getUniqueSources()

  return (
    <CollectionsPageClient
      collections={collections}
      categories={categories}
      tags={tags}
      sources={sources}
    />
  )
}
