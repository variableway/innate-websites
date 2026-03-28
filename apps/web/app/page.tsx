import { HeroSwitcher } from "@/components/hero"
import { FeaturedSection } from "@/components/featured-section"

export default function HomePage() {
  return (
    <div className="min-h-full">
      <HeroSwitcher />
      <FeaturedSection />
    </div>
  )
}
