import { Calendar } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-5 w-5 text-[#8FA68E]" />
        <h1 className="text-xl font-semibold text-foreground">Events</h1>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#8FA68E]/10 flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-[#8FA68E]" />
        </div>
        <h2 className="text-lg font-medium text-foreground mb-2">
          Upcoming Events
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Stay tuned for upcoming workshops, webinars, and community events.
        </p>
      </div>
    </div>
  )
}
