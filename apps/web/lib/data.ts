import type { NavSection, Post, Course, CourseSection, Community, Tag } from "./types"

export const navigationSections: NavSection[] = [
  {
    title: "Superlinear AI",
    items: [
      { id: "1", label: "公开课与行业交流", icon: "graduation", href: "/course/public-courses", badge: undefined },
      { id: "2", label: "AI时代编程基础：指挥AI...", icon: "lock", href: "/course/ai-programming", isLocked: true },
      { id: "3", label: "AI Builders：边动手，边...", icon: "graduation", href: "/course/ai-builders" },
      { id: "4", label: "AI Architects：构建AI复...", icon: "lock", href: "/course/ai-architects", isLocked: true },
      { id: "5", label: "Knowledge Bank", icon: "book", href: "/knowledge-bank" },
      { id: "6", label: "Deep News", icon: "news", href: "/deep-news" },
      { id: "7", label: "Share Your Projects", icon: "edit", href: "/share-projects" },
      { id: "8", label: "Share your Insights", icon: "edit", href: "/share-insights" },
      { id: "9", label: "General Discussion...", icon: "message", href: "/general-discussion", badge: 5 },
      { id: "10", label: "Trial and Iteration", icon: "message", href: "/trial-iteration", badge: 3 },
      { id: "11", label: "Questions and An...", icon: "message", href: "/questions", badge: 7 },
      { id: "12", label: "Agentic AI的原理与实践", icon: "lock", href: "/agentic-ai", isLocked: true },
    ],
  },
  {
    title: "社区公共空间",
    items: [
      { id: "13", label: "社区公告", icon: "megaphone", href: "/announcements" },
      { id: "14", label: "新会员自我介绍", icon: "edit", href: "/introductions", badge: 58 },
      { id: "15", label: "公开分享", icon: "edit", href: "/public-share", badge: 12 },
      { id: "16", label: "招聘与合作", icon: "edit", href: "/hiring", badge: 4 },
      { id: "17", label: "许愿池", icon: "message", href: "/wishes", badge: 3 },
      { id: "18", label: "直播活动", icon: "live", href: "/events", badge: 1 },
    ],
  },
  {
    title: "课代表尊贵的会员们",
    items: [
      { id: "19", label: "主题：你心底里最常出现...", icon: "lock", href: "/theme", isLocked: true },
      { id: "20", label: "闲聊讨论", icon: "lock", href: "/chat", isLocked: true },
      { id: "21", label: "干货分享", icon: "lock", href: "/resources", isLocked: true },
      { id: "22", label: "广场 | 功能性空间", icon: "lock", href: "/plaza", isLocked: true },
      { id: "23", label: "真本事：如何从会工作到...", icon: "lock", href: "/skills", isLocked: true },
    ],
  },
]

// Tags
export const tags: Tag[] = [
  { id: "1", name: "AI", slug: "ai", color: "#8FA68E" },
  { id: "2", name: "Coding", slug: "coding", color: "#7A9CAE" },
  { id: "3", name: "Design", slug: "design", color: "#D4845E" },
  { id: "4", name: "Product", slug: "product", color: "#E89B73" },
  { id: "5", name: "Career", slug: "career", color: "#9BB5C4" },
  { id: "6", name: "Tutorial", slug: "tutorial", color: "#A8C5A8" },
  { id: "7", name: "News", slug: "news", color: "#8B7355" },
  { id: "8", name: "Experience", slug: "experience", color: "#6B8E9B" },
]

// Feed: 个人关注流（模拟用户关注的内容）
export const feedPosts: Post[] = [
  {
    id: "f1",
    slug: "claude-artifacts-prototyping",
    title: "Today I learned: 使用 Claude 的 Artifacts 功能快速原型设计",
    summary: "今天尝试了 Claude 的 Artifacts 功能，发现它在快速原型设计上非常强大。可以直接生成可交互的 React 组件，并且支持实时预览。相比传统流程需要先用 Figma 画原型，现在直接用 Claude 生成可点击的演示版本，效率提升了至少 3 倍。",
    content: `# Today I learned: 使用 Claude 的 Artifacts 功能快速原型设计

今天尝试了 Claude 的 Artifacts 功能，发现它在快速原型设计上非常强大。

## 使用场景

需要给客户展示一个数据仪表盘的初步设计。传统流程：
1. 用 Figma 画原型
2. 交给开发实现
3. 反复修改

现在用 Claude Artifacts：
1. 描述需求
2. 生成可交互的 React 组件
3. 实时预览和修改

## 效率提升

至少提升了 **3 倍**！

\`\`\`jsx
// Claude 生成的示例代码
function Dashboard() {
  return (
    <div className="p-4">
      <h1>数据仪表盘</h1>
      {/* 组件内容 */}
    </div>
  )
}
\`\`\`

## 总结

Claude Artifacts 特别适合：
- 快速原型验证
- 客户演示
- 团队协作`,
    date: "2h",
    author: {
      name: "Alex Chen",
      avatar: "/avatars/user1.jpg",
      role: "Member",
      memberSince: "March 1, 2026",
    },
    likes: 12,
    comments: 4,
    likedBy: ["/avatars/user2.jpg", "/avatars/user3.jpg"],
    tags: ["ai", "tutorial"],
    category: "log",
    isEditorsPick: false,
    readTime: 3,
  },
  {
    id: "f2",
    slug: "react-19-use-hook",
    title: "React 19 新特性尝鲜：use() 函数的实际应用",
    summary: "React 19 的 use() 函数让数据获取变得更简单了。不再需要 useEffect + useState 的组合，直接在组件中 use(promise) 即可。代码更简洁，错误处理更直观，配合 Suspense 体验很好。",
    content: `# React 19 新特性尝鲜：use() 函数的实际应用

React 19 的 \`use()\` 函数让数据获取变得更简单了。

## 传统方式

\`\`\`jsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchData().then(data => {
    setData(data)
    setLoading(false)
  })
}, [])
\`\`\`

## 新方式

\`\`\`jsx
const data = use(fetchData())
\`\`\`

## 好处

1. 代码更简洁
2. 错误处理更直观
3. 配合 Suspense 体验很好`,
    date: "5h",
    author: {
      name: "Sarah Li",
      avatar: "/avatars/user2.jpg",
      role: "Member",
      memberSince: "February 15, 2026",
    },
    likes: 8,
    comments: 2,
    likedBy: ["/avatars/user1.jpg", "/avatars/user4.jpg"],
    tags: ["coding", "tutorial"],
    category: "article",
    isEditorsPick: true,
    readTime: 5,
  },
  {
    id: "f3",
    slug: "ai-coding-week-3",
    title: "分享我的 AI Coding 学习笔记 - Week 3",
    summary: "这周主要学习了 Cursor 的高级快捷键、AI 辅助代码审查的最佳实践、如何写更好的 Prompt 让 AI 理解需求。发现一个小技巧：在 Prompt 中加上 'explain your reasoning' 可以让 AI 给出更详细的解释。",
    content: `# 分享我的 AI Coding 学习笔记 - Week 3

这周主要学习了：

## 学习内容

1. **Cursor 的高级快捷键**
   - Cmd+K: 快速编辑
   - Cmd+L: 聊天模式
   - Tab: 智能补全

2. **AI 辅助代码审查的最佳实践**
   - 让 AI 解释代码逻辑
   - 发现潜在 bug
   - 优化建议

3. **Prompt 技巧**

> 小技巧：加上 "explain your reasoning"

这让 AI 给出更详细的解释，同时也提高了代码质量。`,
    date: "1d",
    author: {
      name: "Mike Wang",
      avatar: "/avatars/user3.jpg",
      role: "Member",
      memberSince: "January 20, 2026",
    },
    likes: 15,
    comments: 6,
    likedBy: ["/avatars/user1.jpg", "/avatars/user2.jpg", "/avatars/user4.jpg"],
    tags: ["ai", "coding", "experience"],
    category: "log",
    isEditorsPick: false,
    readTime: 4,
  },
  {
    id: "f4",
    slug: "design-system-consistency",
    title: "构建设计系统的一致性：从组件到模式",
    summary: "设计系统不仅仅是组件库，更重要的是建立一套模式语言。本文分享了如何在团队中推广设计系统，确保产品的一致性和可维护性。",
    content: `# 构建设计系统的一致性：从组件到模式

设计系统不仅仅是组件库，更重要的是建立一套模式语言。

## 组件 vs 模式

**组件**是具体的 UI 元素：
- Button
- Input
- Card

**模式**是解决特定问题的方案：
- 表单提交模式
- 数据展示模式
- 错误处理模式

## 推广策略

1. 文档先行
2. 代码示例
3. 设计审查
4. 持续迭代`,
    date: "1d",
    author: {
      name: "Emily Zhang",
      avatar: "/avatars/user5.jpg",
      role: "Member",
      memberSince: "February 28, 2026",
    },
    likes: 22,
    comments: 8,
    likedBy: ["/avatars/user2.jpg", "/avatars/user3.jpg"],
    tags: ["design", "product"],
    category: "article",
    isEditorsPick: true,
    readTime: 8,
  },
  {
    id: "f5",
    slug: "career-transition-ai-era",
    title: "AI 时代的职业转型：从开发者到 AI 工程师",
    summary: "分享我从传统开发者转型为 AI 工程师的经历。包括学习路径、技能栈转变、以及在转型过程中遇到的挑战和收获。",
    content: `# AI 时代的职业转型：从开发者到 AI 工程师

分享我的转型经历。

## 背景

做了 5 年传统 Web 开发，去年决定转型 AI 方向。

## 学习路径

1. **基础**：Python、机器学习基础
2. **框架**：LangChain、LlamaIndex
3. **实践**：个人项目
4. **工作**：寻找 AI 相关机会

## 挑战

- 学习曲线陡峭
- 需要持续跟进最新技术
- 实践经验不足

## 收获

看到了更广阔的技术世界。`,
    date: "2d",
    author: {
      name: "David Liu",
      avatar: "/avatars/user6.jpg",
      role: "Member",
      memberSince: "January 10, 2026",
    },
    likes: 34,
    comments: 12,
    likedBy: ["/avatars/user1.jpg", "/avatars/user2.jpg", "/avatars/user5.jpg"],
    tags: ["career", "ai", "experience"],
    category: "article",
    isEditorsPick: false,
    readTime: 10,
  },
]

// Deep News: 官方精选内容（深度分析文章）
export const newsPosts: Post[] = [
  {
    id: "n1",
    slug: "claude-dispatch-analysis",
    title: "Claude Dispatch 深度分析：Anthropic 的 OpenClaw 应答，以及 AI Agent 平台分野的底层逻辑",
    summary: "本文从产品决策和 axiom 体系两个维度，拆解 Claude Dispatch 发布的战略意图。Claude Dispatch 是 Anthropic 对企业工作流的直接回应，与 OpenClaw 相比，更注重「人机协作」而非「AI 替代」。",
    content: `# Claude Dispatch 深度分析

调研日期：2026-03-18

## 背景

Anthropic 于 3 月 17 日发布 Claude Dispatch（Cowork 子功能）。

## 核心观点

1. **Claude Dispatch** 是 Anthropic 对企业工作流的直接回应
2. 与 OpenClaw 相比，更注重「人机协作」而非「AI 替代」
3. 平台分野：通用型 vs 垂直型 Agent 的不同演进路径

## 详细分析

\`\`\`
// 架构对比
Claude Dispatch: 人机协作
OpenClaw: AI 自主执行
\`\`\`

## 结论

未来的 AI Agent 将呈现多元化发展趋势。`,
    date: "3d",
    author: {
      name: "Innate Editorial",
      avatar: "/avatars/admin.jpg",
      role: "Editor",
      memberSince: "January 5, 2026",
    },
    likes: 28,
    comments: 12,
    likedBy: ["/avatars/user1.jpg", "/avatars/user2.jpg", "/avatars/user3.jpg"],
    tags: ["ai", "news"],
    category: "news",
    isFeatured: true,
    isEditorsPick: true,
    readTime: 15,
  },
  {
    id: "n2",
    slug: "attention-residuals-transformer",
    title: "Attention Residuals：用 Attention 修复 Transformer 深度维度上的信号稀释",
    summary: "Moonshot AI 的 Kimi Team 发布技术报告，挑战了 Transformer 架构中残差连接的基础组件。提出 Attention Residuals 机制，在 32B 参数模型上验证了效果，并已开源实现代码。",
    content: `# Attention Residuals：修复 Transformer 信号稀释

Moonshot AI 的 Kimi Team 于 2026 年 3 月 15 日发布技术报告。

## 问题：隐态稀释

标准 PreNorm Transformer 中，每一层把当前层输出加回到之前所有层的累积结果上。

## 创新点

提出 **Attention Residuals** 机制：

\`\`\`python
# 伪代码
attention_residual = attention(x) + residual(x)
\`\`\`

## 实验结果

- 在 32B 参数模型上验证
- 效果提升明显
- 已开源代码`,
    date: "5d",
    author: {
      name: "Innate Editorial",
      avatar: "/avatars/admin.jpg",
      role: "Editor",
      memberSince: "January 5, 2026",
    },
    likes: 45,
    comments: 8,
    likedBy: ["/avatars/user1.jpg", "/avatars/user4.jpg", "/avatars/user5.jpg"],
    tags: ["ai", "coding"],
    category: "news",
    isFeatured: true,
    isEditorsPick: true,
    readTime: 12,
  },
]

// 兼容旧代码：posts 指向所有内容
export const posts = [...feedPosts, ...newsPosts]

// 获取所有文章（用于 Feed）
export const allPosts = [...feedPosts, ...newsPosts].sort((a, b) => {
  // 简单排序，实际应该按日期
  return 0
})

export const courseSections: CourseSection[] = [
  {
    id: "1",
    title: "公司培训",
    totalDuration: "2 hr 17 min",
    lessons: [
      { id: "1-1", title: "Pinterest - 数据科学家如何不被AI取代，并持续从AI进步中获益？（英文）", duration: "58:26", completed: false },
      { id: "1-2", title: "DoorDash - 如何通过管理context，让AI高质量完成工作？（英文）", duration: "24:42", completed: false },
      { id: "1-3", title: "Amazon - AI自动化weekly business review的五层境界（中文）", duration: "54:10", completed: false },
    ],
  },
  {
    id: "2",
    title: "行业交流",
    totalDuration: "7 hr 47 min",
    lessons: [
      { id: "2-1", title: "Data Analytics in the Age of AI: OpenAI, Anthroic, Gen, Lyft, Doordash", duration: "01:38:25", completed: false },
      { id: "2-2", title: "AI会如何改变教育？@耶鲁大学中国中心", duration: "02:51:10", completed: false },
      { id: "2-3", title: "为什么感受不到AI的颠覆？ @Lead Forward", duration: "01:25:05", completed: false },
      { id: "2-4", title: "Decision Making in the Age of AI: 课代表，Cassie Kozyrkov，Tim Chan", duration: "59:09", completed: false },
      { id: "2-5", title: "与The Pragmatic Engineer，关于AI对软件行业影响的访谈", duration: "54:10", completed: false },
    ],
  },
  {
    id: "3",
    title: "付费课程试听",
    totalDuration: "2 hr 41 min",
    lessons: [
      { id: "3-1", title: "AI Coding, 第二课：环境亲和力——第一次配置开发环境", duration: "19:09", completed: false },
    ],
  },
]

export const courses: Course[] = [
  {
    id: "1",
    title: "AI Architect - English",
    description: "Superlinear AI (English)",
    image: "/courses/ai-architect.jpg",
    organization: "Superlinear AI (English)",
    isPrivate: true,
  },
  {
    id: "2",
    title: "AI Builders - English",
    description: "Build with AI: Supercharge Your Productivity and Master First Principles",
    image: "/courses/ai-builders.jpg",
    organization: "Superlinear AI (English)",
    isPrivate: true,
  },
  {
    id: "3",
    title: "公开课与行业交流",
    description: "",
    image: "/courses/public-course.jpg",
    organization: "Superlinear AI",
    isPrivate: false,
    progress: 0,
  },
  {
    id: "4",
    title: "AI时代编程基础：指挥AI动手干活；让自己从建议者变成行动者",
    description: "",
    image: "/courses/ai-coding.jpg",
    organization: "Superlinear AI",
    isPrivate: true,
  },
  {
    id: "5",
    title: "AI Architects：构建AI复利系统，持续快速落地深度AI项目，吃到时代...",
    description: "",
    image: "/courses/ai-architects-cn.jpg",
    organization: "Superlinear AI",
    isPrivate: true,
  },
  {
    id: "6",
    title: "AI Builders：边动手，边掌握AI时代的工程原则，在工作中产出靠谱结果",
    description: "",
    image: "/courses/ai-builders-cn.jpg",
    organization: "Superlinear AI",
    isPrivate: true,
  },
  {
    id: "7",
    title: "Agentic AI的原理与实践",
    description: "",
    image: "/courses/agentic-ai.jpg",
    organization: "Superlinear AI",
    isPrivate: true,
  },
  {
    id: "8",
    title: "真本事：如何从会工作到会赚钱？",
    description: "",
    image: "/courses/skills.jpg",
    organization: "课代表尊贵的会员们",
    isPrivate: true,
  },
]

export const communities: Community[] = [
  {
    id: "1",
    title: "Faith-based discipleship community for supernatural spiritual growth.",
    description: "Faith-based discipleship community for supernatural spiritual growth.",
    image: "/communities/forerunners.jpg",
    price: "From $1,000",
    priceType: "/ month",
    organization: "Forerunners",
  },
  {
    id: "2",
    title: "A science-backed community helping midlife women get strong and age well.",
    description: "No sugarcoating. No hype. Just the facts.",
    image: "/communities/ajenda.jpg",
    price: "$149",
    priceType: "",
    organization: "Ajenda",
  },
  {
    id: "3",
    title: "A movement education community focused on Pilates, mobility, and body awareness.",
    description: "Take your first step to feeling #zebrastrong",
    image: "/communities/zebra-club.jpg",
    price: "From $19",
    priceType: "/ month",
    organization: "The Zebra Club",
  },
  {
    id: "4",
    title: "Community and learning hub for mastering AI tools and skills.",
    description: "THE PLACE FOR PEOPLE LEARNING HOW TO USE AI",
    image: "/communities/aiville.jpg",
    price: "From $97",
    priceType: "/month",
    organization: "Aiville",
  },
  {
    id: "5",
    title: "A membership community focused on sustainable intermittent fasting.",
    description: "",
    image: "/communities/delay.jpg",
    price: "From $9",
    priceType: "/month",
    organization: "Delay, Don't Deny Community",
  },
  {
    id: "6",
    title: "Cohort-based AI building course for lasting skill and mindset growth.",
    description: "",
    image: "/communities/superlinear.jpg",
    price: "$648",
    priceType: "",
    organization: "Superlinear Academy",
  },
  {
    id: "7",
    title: "Supportive global Korean learning community.",
    description: "Making people happy through Korean learning",
    image: "/communities/korean.jpg",
    price: "From $87",
    priceType: "/ month",
    organization: "Everyday Korean",
  },
  {
    id: "8",
    title: "Reclaim the Truth of Who You Are and create a life that is worthy of you.",
    description: "Quantum Human Design",
    image: "/communities/quantum.jpg",
    price: "FREE",
    priceType: "",
    organization: "Quantum Human Design",
  },
  {
    id: "9",
    title: "A monthly membership for notaries ready to grow with advanced training and community...",
    description: "",
    image: "/communities/signature.jpg",
    price: "$1,250",
    priceType: "/ year",
    organization: "Signature Success Community",
  },
  {
    id: "10",
    title: "Community for women to read Scripture, pray, and grow faith together",
    description: "Let's read the Bible and grow in our faith together!",
    image: "/communities/bible.jpg",
    price: "$1",
    priceType: "/month",
    organization: "Bible Study Co.",
  },
]

export const categories = [
  "Explore",
  "Be more productive",
  "Start and scale my business",
  "Improve my health",
  "Grow my brand and audience",
  "Build my tech skills",
  "Lead with confidence",
  "Grow my network",
  "Strengthen my relationships",
  "Grow my career",
]

export const courseLevels = ["All", "高级", "中级", "入门"]
