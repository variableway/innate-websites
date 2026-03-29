import { getAllTutorials } from "@/lib/tutorials-server"
import { TutorialList } from "@/components/tutorial-card"
import { Sparkles, BookOpen, Clock, Zap } from "lucide-react"

export const metadata = {
  title: "Tutorials - Innate",
  description: "5分钟上手的小工具教程，copy & modify，即刻看到效果",
}

export default async function TutorialsPage() {
  const tutorials = await getAllTutorials()

  return (
    <div className="min-h-full bg-background">
      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">学习路径</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            5分钟教程
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            找到一个小工具，copy 代码，5分钟内看到效果。每一篇都包含完整的 Go 语言学习要点。
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground">{tutorials.length}</strong> 个教程
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                平均 <strong className="text-foreground">5</strong> 分钟
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                copy & modify 即用
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {tutorials.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">暂无教程</h3>
            <p className="text-muted-foreground">教程内容正在准备中...</p>
          </div>
        ) : (
          <TutorialList tutorials={tutorials} groupBy="difficulty" />
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground text-sm">
            what drives you and what you make, makes you.
          </p>
        </div>
      </div>
    </div>
  )
}
