import type { NavSection, Post, Course, CourseSection, Community } from "./types"

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

export const posts: Post[] = [
  {
    id: "1",
    title: "Claude Dispatch 深度分析：Anthropic 的 OpenClaw 应答，以及 AI Agent 平台分野的底层逻辑",
    content: `调研日期：2026-03-18

触发：Anthropic 于 3 月 17 日发布 Claude Dispatch（Cowork 子功能），Latent Space 当天以 Anthropic's Answer to OpenClaw 为标题报道。结合此前的 OpenClaw 深度分析（2026-02-14），本文从产品决策和 axiom 体系两个维度，拆解这次发布的...`,
    date: "3d",
    author: {
      name: "Superlinear Academy",
      avatar: "/avatars/admin.jpg",
      role: "Admin",
      memberSince: "January 5, 2026",
    },
    likes: 5,
    comments: 2,
    likedBy: ["/avatars/user1.jpg", "/avatars/user2.jpg", "/avatars/user3.jpg"],
  },
  {
    id: "2",
    title: "Attention Residuals：用 Attention 修复 Transformer 深度维度上的信号稀释",
    content: `Moonshot AI 的 Kimi Team 于 2026 年 3 月 15 日发布了一篇技术报告，挑战了 Transformer 架构中一个存在近十年、每个主流大模型都在使用的基础组件：残差连接（residual connection）。

问题：隐态稀释

标准 PreNorm Transformer 中，每一层的工作方式可以简化为：把当前层的输出加回到之前所有层的累积结果上。数学上...`,
    date: "3d",
    author: {
      name: "Superlinear Academy",
      avatar: "/avatars/admin.jpg",
      role: "Admin",
      memberSince: "January 5, 2026",
    },
    likes: 3,
    comments: 0,
    likedBy: ["/avatars/user1.jpg", "/avatars/user4.jpg", "/avatars/user5.jpg"],
  },
]

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
