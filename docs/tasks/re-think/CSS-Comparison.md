# Apps CSS 格式对比文档

## 1. 项目概览

| 项目 | CSS 文件路径 | Tailwind 版本 | 色彩格式 |
|------|-------------|---------------|----------|
| **super** | `app/globals.css` + `styles/globals.css` (相同内容) | v4 (`@import 'tailwindcss'`) | oklch |
| **web** | `app/globals.css` | v4 (`@import 'tailwindcss'`) | oklch |
| **onur-dev** | `app/globals.css` | v4 (`@import 'tailwindcss'`) | oklch |
| **packages/ui** | `src/globals.css` | v4 (`@import 'tailwindcss'`) | oklch |

> 注: `onur-dev/styles/globals.css` 使用旧版 Tailwind v3 语法 (`@tailwind base; @tailwind components; @tailwind utilities;`) + HSL 色彩格式，但 layout.tsx 导入的是 `app/globals.css`，该文件已是 v4 格式。`styles/globals.css` 是遗留文件，未被使用。

---

## 2. 公共部分 (完全一致)

以下内容在 **super**、**web**、**onur-dev** 三个项目中完全相同，也与 `packages/ui` 一致：

### 2.1 引入和暗色模式声明

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@custom-variant dark (&:is(.dark *));
```

### 2.2 `:root` 亮色主题变量

| 变量 | 值 |
|------|----|
| `--background` | `oklch(1 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` |
| `--card` | `oklch(1 0 0)` |
| `--card-foreground` | `oklch(0.145 0 0)` |
| `--popover` | `oklch(1 0 0)` |
| `--popover-foreground` | `oklch(0.145 0 0)` |
| `--primary` | `oklch(0.205 0 0)` |
| `--primary-foreground` | `oklch(0.985 0 0)` |
| `--secondary` | `oklch(0.97 0 0)` |
| `--secondary-foreground` | `oklch(0.205 0 0)` |
| `--muted` | `oklch(0.97 0 0)` |
| `--muted-foreground` | `oklch(0.556 0 0)` |
| `--accent` | `oklch(0.97 0 0)` |
| `--accent-foreground` | `oklch(0.205 0 0)` |
| `--destructive` | `oklch(0.577 0.245 27.325)` |
| `--destructive-foreground` | `oklch(0.577 0.245 27.325)` |
| `--chart-1` ~ `--chart-5` | 全部相同 |
| `--radius` | `0.625rem` |
| `--sidebar-*` (7个变量) | 全部相同 |

### 2.3 `.dark` 暗色主题变量

所有暗色变量在三个项目中完全一致。

### 2.4 `@theme inline` 声明

字体和颜色映射在三个项目中完全一致：

- `--font-sans: 'Geist', 'Geist Fallback'`
- `--font-mono: 'Geist Mono', 'Geist Mono Fallback'`
- 所有 `--color-*` 映射
- 所有 `--radius-*` 计算

### 2.5 `@layer base` 基础样式

```css
* {
  @apply border-border outline-ring/50;
}
body {
  @apply bg-background text-foreground;
}
```

### 2.6 PostCSS 配置

三个项目均使用 `@tailwindcss/postcss`，无额外插件。

---

## 3. 差异对比

### 3.1 `:root` 亮色主题 - border / input 差异

| 变量 | super | web | onur-dev |
|------|-------|-----|----------|
| `--border` | `oklch(0.922 0 0)` | **`oklch(0.85 0 0)`** | `oklch(0.922 0 0)` |
| `--input` | `oklch(0.922 0 0)` | **`oklch(0.85 0 0)`** | `oklch(0.922 0 0)` |
| `--sidebar-border` | `oklch(0.922 0 0)` | **`oklch(0.85 0 0)`** | `oklch(0.922 0 0)` |

> **web 项目的边框颜色更深** (`0.85` vs `0.922`)，视觉上边框会更明显。

### 3.2 `.dark` 暗色主题 - border / input 差异

| 变量 | super | web | onur-dev |
|------|-------|-----|----------|
| `--border` | `oklch(0.269 0 0)` | **`oklch(0.3 0 0)`** | `oklch(0.269 0 0)` |
| `--input` | `oklch(0.269 0 0)` | **`oklch(0.3 0 0)`** | `oklch(0.269 0 0)` |
| `--sidebar-border` | `oklch(0.269 0 0)` | **`oklch(0.3 0 0)`** | `oklch(0.269 0 0)` |

> **web 项目暗色模式边框稍亮** (`0.3` vs `0.269`)。

### 3.3 `@layer base` 扩展内容

| 内容 | super | web | onur-dev |
|------|-------|-----|----------|
| 基础 `*` 和 `body` 规则 | ✅ | ✅ | ✅ |
| `h1-h6` 字重 700 | ❌ | ✅ | ❌ |
| `p, span, div` 字重 450 | ❌ | ✅ | ❌ |
| `body` 字重 450 | ❌ | ✅ | ❌ |
| `.border` 边框加粗 (1.5px) | ❌ | ✅ | ❌ |
| `.border-2` 加粗 (2.5px) | ❌ | ✅ | ❌ |
| `.border-l/r/t/b-2` 加粗 (2.5px) | ❌ | ✅ | ❌ |
| `.border-l/r/t/b-4` 加粗 (4px) | ❌ | ✅ | ❌ |

### 3.4 自定义动画 (仅 web)

web 项目额外定义了以下动画和工具类，其他两个项目没有：

| 动画 | 用途 |
|------|------|
| `float` | 上下浮动 |
| `float-slow/medium/fast` | 不同速度的浮动 |
| `float-rotate` | 浮动+旋转 |
| `spin-slow` | 缓慢旋转 |
| `pulse-slow` | 缓慢脉冲 |
| `twinkle` | 闪烁效果 |

工具类：`.animate-float-*`、`.delay-*`、`.scrollbar-hide`、`.mobile-full-width`

### 3.5 CSS 文件冗余

| 项目 | 实际使用 | 未使用 (遗留) |
|------|---------|-------------|
| onur-dev | `app/globals.css` (v4 oklch) | `styles/globals.css` (v3 HSL) |
| super | `app/globals.css` | `styles/globals.css` (内容与 app/ 相同，冗余) |

### 3.6 `--ring` 亮色模式

| 项目 | 值 |
|------|----|
| super | `oklch(0.708 0 0)` |
| web | `oklch(0.708 0 0)` |
| onur-dev | `oklch(0.708 0 0)` |

> ring 变量一致，无差异。

---

## 4. 差异汇总表

| 维度 | super | web | onur-dev |
|------|-------|-----|----------|
| **Tailwind 版本** | v4 | v4 | v4 |
| **色彩格式** | oklch | oklch | oklch |
| **亮色 border** | 0.922 (浅) | 0.85 (深) | 0.922 (浅) |
| **暗色 border** | 0.269 (深) | 0.3 (浅) | 0.269 (深) |
| **radius** | 0.625rem | 0.625rem | 0.625rem |
| **字重覆盖** | 无 | h1-h6:700, body/p/span/div:450 | 无 |
| **边框加粗覆盖** | 无 | border:1.5px, border-2:2.5px | 无 |
| **自定义动画** | 无 | 8个动画 + 工具类 | 无 |
| **遗留 CSS 文件** | styles/globals.css (冗余) | 无 | styles/globals.css (v3遗留) |

---

## 5. 建议

1. **统一 border 值**: web 项目的 `--border` / `--input` 与其他两个项目不同，建议确认是否为有意设计，如果是则统一；如果是有意区分则保留
2. **清理遗留文件**: `onur-dev/styles/globals.css` 是 Tailwind v3 遗留文件，应删除；`super/styles/globals.css` 与 `app/globals.css` 重复，也应删除
3. **抽取公共部分**: 三个项目的 `:root`、`.dark`、`@theme inline` 基本相同，可考虑抽取到 `packages/ui/src/globals.css` 中统一管理，各 app 仅保留差异部分和自定义扩展
4. **web 独有样式**: 字重覆盖、边框加粗、动画等是 web 项目特有的，适合保留在 web 自己的 globals.css 中
