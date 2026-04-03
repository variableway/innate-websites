import type { BlogPost } from "./types"
import { getAllPosts as getDbPosts } from "./posts-storage"

// Mock markdown posts data (in production, this would be read from actual files during build)
const MARKDOWN_POSTS_DATA = [
  {
    filename: "understanding-web-apps.md",
    frontmatter: {
      title: "理解Web应用：用餐厅比喻解释编程概念",
      date: "2024-01-20",
      excerpt: "对于完全不懂编程的人来说，自顶向下的学习路径是最直观的。让我们用开一家餐厅的比喻来理解现代Web应用的核心概念。",
      tags: ["编程入门", "Web开发", "教程"],
      slug: "understanding-web-apps",
    },
    content: `对于完全不懂编程的人来说，**"自顶向下"**（从看到的界面到背后的数据）的学习路径是最直观的。

我们可以把一个应用程序比作一家**餐厅**：

## UI（布局/交互） → 餐厅的装修和菜单

- **布局**：桌椅怎么摆，灯光怎么打（CSS/HTML）
- **交互**：客人翻菜单、按呼叫铃（JavaScript/React/Vue）
- 这是用户"看得到、摸得着"的地方

## 交互（操作和数据交换） → 服务员

客人点菜后，服务员把需求记下来，传递给后厨。前端（浏览器）不会自己变出数据，它需要去"请求"数据。

## 数据提供（API接口） → 传菜窗口/订单条

**API**：服务员和后厨沟通的"标准格式语言"（比如：3号桌，宫保鸡丁，微辣）。不能乱喊，要有规矩（RESTful/GraphQL）。

## 后端（接口、框架、逻辑） → 厨房与厨师

- **框架**：厨房的流水线设计（Spring Boot/Django/Node.js）
- **业务逻辑**：怎么炒菜，先放油还是先放盐，会员打几折

## 数据库（SQL、表） → 仓库/冰箱

- **表**：蔬菜柜、肉柜
- **SQL/查询**：去仓库拿二斤猪肉的操作指令
- **ORM**：一种自动翻译机，让厨师不用懂仓库管理的专业术语

## 构建软件/依赖管理 → 餐厅的水电煤气与进货渠道

- **依赖管理（npm/pip）**：你需要买酱油，不需要自己酿，直接买现成的（第三方库）
- **构建工具（Webpack/Vite）**：把原材料打包成可以上桌的菜品`,
  },
  {
    filename: "ai-agents-for-beginners.md",
    frontmatter: {
      title: "AI Agent：初学者的最佳编程老师",
      date: "2024-01-18",
      excerpt: "现在的 AI Agent 属于全栈生成式工具，对于初学者来说，不需要分别去学 SQL、配置 Webpack 或者写 CSS。",
      tags: ["AI", "工具推荐", "编程入门"],
      slug: "ai-agents-for-beginners",
    },
    content: `对于初学者，现在不需要分别去学 SQL、配置 Webpack 或者写 CSS。现在的 AI Agent 属于**"全栈生成式"**工具。

## Bolt.new (由 StackBlitz 开发) — 目前最推荐

它是一个在浏览器里运行的完整开发环境：

- 你用自然语言描述："做一个待办事项应用，要能保存数据"
- **UI/交互**：它自动写 React/Tailwind 代码，并实时渲染出界面
- **依赖管理**：它自动识别需要什么包，自动运行 npm install 安装
- **后端/构建**：它自动配置构建工具（Vite），甚至可以模拟后端逻辑

**优势**：所见即所得。它把"构建工具"和"依赖管理"完全自动化了。

## Replit Agent (Replit Core)

从想法到部署的端到端 Agent：

- 你告诉它："我想做一个类似 Twitter 的留言板"
- **全流程管理**：它会思考计划，先创建数据库（Postgres），再写后端，再写前端
- **数据库管理**：它会自动帮你设置数据库，甚至帮你写 SQL 建表
- **部署**：一键发布到互联网

**优势**：真正的全栈。它非常擅长处理后端和数据库的配置。

## Cursor (配合 Composer 功能) — 进阶选择

一个 AI 驱动的代码编辑器：

- 它不是"一键生成"，而是"结对编程"
- 你可以打开 Composer 模式，说："帮我创建一个 Next.js 项目，连接 SQLite 数据库"
- 它会一步步生成文件，运行终端命令

**优势**：学习性强。你能看到每一个文件是怎么被创建出来的。

## v0 (由 Vercel 开发)

专注于 UI/UX 的生成，主要解决界面布局问题，生成极其精美的界面代码。`,
  },
  {
    filename: "quick-start-guide.md",
    frontmatter: {
      title: "1小时快速上手：从零构建你的第一个应用",
      date: "2024-01-16",
      excerpt: "如果我想让一个完全不懂编程的朋友，在1小时内理解并做出一个东西，我会让他按照这个顺序操作。",
      tags: ["教程", "实战", "快速入门"],
      slug: "quick-start-guide",
    },
    content: `如果我想让一个完全不懂编程的朋友，在 1 小时内理解并做出一个东西，我会让他按照这个顺序操作：

## 步骤一：视觉化概念 (使用 v0.dev)

**操作**：让他去 v0.dev 输入"设计一个图书管理系统的仪表盘，要有数据图表和书籍列表"。

**目的**：理解 **UI 和 布局**。让他看到 AI 是如何把文字变成界面的。

## 步骤二：全栈实现 (使用 Bolt.new)

**操作**：去 bolt.new，输入"我要做一个图书管理 App。要有添加书籍的功能，书籍包含名称和作者。数据要能保存"。

**目的**：理解 **交互、逻辑和数据**。

- Bolt 会自动安装依赖（构建工具）
- Bolt 会写出点击"添加"按钮后的逻辑（交互）
- Bolt 会处理数据的存储和读取（模拟后端和数据库）

## 步骤三：查看"幕后" (在 Bolt 或 Cursor 中)

**操作**：让他看 AI 生成的文件列表。

- 指着 package.json 说：这就是**依赖管理**（进货单）
- 指着 .css 或 Tailwind 类名说：这就是**UI布局**（装修）
- 指着 App.jsx 中的 function 说：这就是**业务逻辑**（厨师的操作）

## 总结

你不需要让他先学理论。**直接让他用 Bolt.new 或者 Replit Agent 对话。**

当他发现："我只是说了一句话，AI 就在屏幕右边自动下载了一个叫 lucide-react 的东西（图标库），然后界面上就有了图标"时，他就瞬间理解了什么是**"第三方依赖管理"**和**"项目构建"**。

**AI Agent 就是最好的老师，因为它把抽象的概念变成了实时的反馈。**`,
  },
  {
    filename: "react-hooks-explained.md",
    frontmatter: {
      title: "React Hooks 完全指南",
      date: "2024-01-14",
      excerpt: "深入理解 React Hooks 的工作原理，从 useState 到 useEffect，再到自定义 Hooks。",
      tags: ["React", "JavaScript", "前端"],
      slug: "react-hooks-explained",
    },
    content: `React Hooks 彻底改变了我们编写 React 组件的方式。让我们深入了解最常用的 Hooks。

## useState - 状态管理

useState 是最基础的 Hook，用于在函数组件中添加状态：

const [count, setCount] = useState(0)

每次调用 setCount，组件都会重新渲染。

## useEffect - 副作用处理

useEffect 用于处理副作用，比如数据获取、订阅、手动修改 DOM：

useEffect(() => {
  document.title = "点击了 " + count + " 次"
}, [count])

## useContext - 跨组件通信

当需要在组件树中传递数据时，useContext 比 props drilling 更优雅。

## 自定义 Hooks

自定义 Hooks 让你可以将组件逻辑提取到可重用的函数中。

## 最佳实践

- 只在顶层调用 Hooks
- 只在 React 函数中调用 Hooks
- 使用 ESLint 插件确保正确使用`,
  },
  {
    filename: "typescript-tips.md",
    frontmatter: {
      title: "TypeScript 实用技巧集锦",
      date: "2024-01-12",
      excerpt: "提升 TypeScript 开发效率的实用技巧，包括类型推断、泛型、工具类型等。",
      tags: ["TypeScript", "JavaScript", "类型系统"],
      slug: "typescript-tips",
    },
    content: `TypeScript 不仅仅是给 JavaScript 加类型，它还有很多强大的特性。

## 类型推断

TypeScript 会自动推断变量类型，大多数时候你不需要显式声明：

const numbers = [1, 2, 3] // number[]
const user = { name: 'John', age: 30 } // { name: string; age: number }

## 泛型的力量

泛型让你的代码更加灵活和可重用：

function identity<T>(arg: T): T {
  return arg
}

## 工具类型

TypeScript 内置了很多实用的工具类型：

- Partial<T> - 将所有属性变为可选
- Required<T> - 将所有属性变为必需
- Pick<T, K> - 选择部分属性
- Omit<T, K> - 排除部分属性

## 条件类型

条件类型让类型系统更加动态。

## 类型守卫

使用类型守卫来缩小类型范围，使代码更加类型安全。`,
  },
  {
    filename: "nextjs-app-router.md",
    frontmatter: {
      title: "Next.js App Router 深度解析",
      date: "2024-01-10",
      excerpt: "全面了解 Next.js 13+ 的 App Router，包括服务器组件、路由、数据获取等核心概念。",
      tags: ["Next.js", "React", "全栈"],
      slug: "nextjs-app-router",
    },
    content: `Next.js 13 引入的 App Router 代表了 React 应用开发的新范式。

## 服务器组件 vs 客户端组件

默认情况下，App Router 中的组件都是服务器组件：

- **服务器组件**：在服务器上渲染，减少客户端 JavaScript
- **客户端组件**：需要交互时使用 "use client" 声明

## 文件系统路由

App Router 使用文件夹结构定义路由：

app/
  page.tsx        // /
  about/
    page.tsx      // /about
  blog/
    [slug]/
      page.tsx    // /blog/:slug

## 数据获取

在服务器组件中可以直接使用 async/await 获取数据。

## 布局和模板

使用 layout.tsx 创建共享布局，它在路由切换时保持状态。

## 加载和错误状态

- loading.tsx - 自动显示加载状态
- error.tsx - 捕获和显示错误

## 最佳实践

- 尽可能使用服务器组件
- 将客户端组件放在组件树的叶子节点
- 合理使用缓存和重验证策略`,
  },
]

// Projects data
export const PROJECTS_DATA = [
  {
    id: "project-1",
    title: "Hybrid CMS",
    description: "支持 Markdown 和数据库双源的内容管理系统",
    tags: ["Next.js", "TypeScript", "CMS"],
    link: "/admin",
    featured: true,
  },
  {
    id: "project-2",
    title: "AI Writing Assistant",
    description: "基于 GPT 的智能写作辅助工具",
    tags: ["AI", "OpenAI", "React"],
    link: "#",
    featured: true,
  },
  {
    id: "project-3",
    title: "Design System",
    description: "可复用的 UI 组件库和设计系统",
    tags: ["React", "Tailwind", "Storybook"],
    link: "#",
    featured: false,
  },
]

// Helper to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const time = Math.ceil(words / wordsPerMinute)
  return `${time} min read`
}

// Helper to format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Tutorial data organized by topics
export interface Tutorial {
  id: string
  title: string
  description: string
  topic: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  date: string
  tags: string[]
}

export const TUTORIALS_DATA: Tutorial[] = [
  {
    id: "react-basics",
    title: "React 基础入门",
    description: "学习 React 的核心概念，包括组件、JSX 和状态管理。",
    topic: "前端框架",
    level: "beginner",
    duration: "2 小时",
    date: "2024-01-25",
    tags: ["React", "JavaScript", "前端"],
  },
  {
    id: "nextjs-full-stack",
    title: "Next.js 全栈开发",
    description: "使用 Next.js 构建完整的全栈应用，包括服务器端渲染和 API 路由。",
    topic: "全栈开发",
    level: "intermediate",
    duration: "4 小时",
    date: "2024-01-24",
    tags: ["Next.js", "全栈", "React"],
  },
  {
    id: "typescript-essentials",
    title: "TypeScript 必知必会",
    description: "掌握 TypeScript 的类型系统和高级特性，提升代码质量。",
    topic: "编程语言",
    level: "intermediate",
    duration: "3 小时",
    date: "2024-01-23",
    tags: ["TypeScript", "JavaScript", "类型系统"],
  },
  {
    id: "css-layout",
    title: "现代 CSS 布局",
    description: "深入学习 Flexbox 和 Grid，构建响应式设计。",
    topic: "样式设计",
    level: "beginner",
    duration: "2.5 小时",
    date: "2024-01-22",
    tags: ["CSS", "布局", "响应式"],
  },
  {
    id: "api-design",
    title: "REST API 设计最佳实践",
    description: "学习如何设计和实现高效的 REST API。",
    topic: "后端开发",
    level: "intermediate",
    duration: "3 小时",
    date: "2024-01-21",
    tags: ["API", "后端", "设计模式"],
  },
  {
    id: "database-sql",
    title: "SQL 数据库基础",
    description: "掌握 SQL 查询和数据库设计基础。",
    topic: "数据库",
    level: "beginner",
    duration: "3.5 小时",
    date: "2024-01-20",
    tags: ["SQL", "数据库", "PostgreSQL"],
  },
  {
    id: "tailwind-css",
    title: "Tailwind CSS 实战指南",
    description: "使用 Tailwind CSS 快速构建现代 UI 界面。",
    topic: "样式设计",
    level: "beginner",
    duration: "2 小时",
    date: "2024-01-19",
    tags: ["Tailwind", "CSS", "UI"],
  },
  {
    id: "git-advanced",
    title: "Git 高级用法",
    description: "掌握分支策略、合并冲突和协作工作流。",
    topic: "开发工具",
    level: "intermediate",
    duration: "2.5 小时",
    date: "2024-01-18",
    tags: ["Git", "版本控制", "协作"],
  },
  {
    id: "authentication",
    title: "Web 认证与授权",
    description: "实现安全的用户认证系统，包括 JWT 和 OAuth。",
    topic: "后端开发",
    level: "advanced",
    duration: "4 小时",
    date: "2024-01-17",
    tags: ["安全", "认证", "后端"],
  },
  {
    id: "performance-optimization",
    title: "网站性能优化",
    description: "学习优化网站加载速度和运行效率的技巧。",
    topic: "前端优化",
    level: "advanced",
    duration: "3.5 小时",
    date: "2024-01-16",
    tags: ["性能", "优化", "前端"],
  },
  {
    id: "testing-strategies",
    title: "单元测试和集成测试",
    description: "编写有效的测试用例，确保代码质量。",
    topic: "质量保证",
    level: "intermediate",
    duration: "3 小时",
    date: "2024-01-15",
    tags: ["测试", "Jest", "质量"],
  },
  {
    id: "docker-basics",
    title: "Docker 容器化基础",
    description: "使用 Docker 容器化应用，简化部署流程。",
    topic: "开发工具",
    level: "intermediate",
    duration: "3 小时",
    date: "2024-01-14",
    tags: ["Docker", "容器", "部署"],
  },
]

/**
 * Fetches all posts from both the Database (simulated) and the Static Markdown Data.
 * This function works in both browser and server environments.
 */
export async function getUnifiedPosts(): Promise<BlogPost[]> {
  // 1. Fetch from "Database" (Dynamic Content)
  const dbPostsRaw = getDbPosts()

  const dbPosts: BlogPost[] = dbPostsRaw.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    date: post.createdAt,
    formattedDate: formatDate(post.createdAt),
    readTime: calculateReadTime(post.content),
    tags: post.tags,
    content: post.content,
    isMarkdown: false,
  }))

  // 2. Process Static Markdown Data
  const filePosts: BlogPost[] = MARKDOWN_POSTS_DATA.map((post) => {
    const { frontmatter, content } = post
    const slug = frontmatter.slug || post.filename.replace(/\.md$/, "")

    return {
      id: `static-${slug}`,
      title: frontmatter.title || "Untitled",
      slug: slug,
      excerpt: frontmatter.excerpt || content.slice(0, 150) + "...",
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString(),
      formattedDate: formatDate(frontmatter.date || new Date().toISOString()),
      readTime: calculateReadTime(content),
      tags: frontmatter.tags || [],
      content: content,
      isMarkdown: true,
    }
  })

  // 3. Merge and Sort
  const allPosts = [...dbPosts, ...filePosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return allPosts
}

/**
 * Generates a meta JSON for external consumption if needed.
 */
export async function generateContentMeta() {
  const posts = await getUnifiedPosts()
  const meta = {
    generatedAt: new Date().toISOString(),
    count: posts.length,
    sources: {
      database: posts.filter((p) => !p.isMarkdown).length,
      markdown: posts.filter((p) => p.isMarkdown).length,
    },
    posts: posts.map(({ content, ...meta }) => meta),
  }

  return meta
}
