import { WeeklyDetail } from "@/components/making/weekly-detail"
import { weeklySummaries } from "@/lib/making/data"

// Generate static params for all weekly summaries
export function generateStaticParams() {
  return weeklySummaries.map((weekly) => ({
    id: weekly.id,
  }))
}

export default function WeeklyDetailPage() {
  return <WeeklyDetail />
}
