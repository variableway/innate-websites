---
title: "5分钟：给 feeds-collectors 添加语言筛选"
description: "copy 这个项目，添加按编程语言筛选功能，学会 Go HTTP 查询参数处理"
type: tutorial
difficulty: intermediate
time: 5min
tool: feeds-collectors
prerequisites: [已安装 Go, 已安装 Node.js]
---

## 它解决什么问题？

你 star 了 1000 个项目，想找 TypeScript 的，只能一页页翻。添加语言筛选，一键只看 JavaScript/Go/Python 项目。

## 效果预览

```bash
# 只获取 TypeScript 项目
curl "http://localhost:8090/api/starred/search?github_user=qdriven&language=TypeScript"

# 返回
{
  "count": 42,
  "data": [
    {"name": "next.js", "language": "TypeScript", "stars": 120000},
    {"name": "shadcn-ui", "language": "TypeScript", "stars": 50000}
  ]
}
```

前端效果：
```
筛选: [全部 ▼] [TypeScript] [Go] [Python] [Rust]

📦 next.js           ⭐ 120k  TypeScript
📦 shadcn-ui         ⭐ 50k   TypeScript
```

## 3步搞定

### Step 1: Copy 项目（1分钟）

```bash
git clone https://github.com/variableway/feeds-collectors.git
cd feeds-collectors
```

### Step 2: 添加后端 API 筛选（2分钟）

**文件: `backend/main.go`**

找到搜索相关的 handler（通常是 `searchStarredRepos` 或类似函数），修改为：

```go
func searchStarredRepos(c echo.Context) error {
    username := c.Param("username")
    language := c.QueryParam("language")  // 获取 ?language=xxx 参数
    minStars := c.QueryParam("min_stars")
    
    // 构建查询
    collection, err := app.Dao().FindCollectionByNameOrId("starred_repos")
    if err != nil {
        return c.JSON(400, map[string]string{"error": err.Error()})
    }
    
    // 使用 PocketBase 的查询
    records, err := app.Dao().FindRecordsByExpr(
        collection,
        // 动态构建条件
        buildFilter(username, language, minStars),
    )
    
    if err != nil {
        return c.JSON(400, map[string]string{"error": err.Error()})
    }
    
    // 转换为响应格式
    var results []map[string]interface{}
    for _, record := range records {
        results = append(results, map[string]interface{}{
            "name":     record.GetString("name"),
            "language": record.GetString("language"),
            "stars":    record.GetInt("stars"),
            "url":      record.GetString("html_url"),
        })
    }
    
    return c.JSON(200, map[string]interface{}{
        "count": len(results),
        "data":  results,
    })
}

// 构建筛选条件
func buildFilter(username, language, minStars string) dbx.Expression {
    conditions := []dbx.Expression{
        dbx.NewExp("github_user = {:user}", dbx.Params{"user": username}),
    }
    
    if language != "" {
        conditions = append(conditions, 
            dbx.NewExp("language = {:lang}", dbx.Params{"lang": language}))
    }
    
    if minStars != "" {
        conditions = append(conditions,
            dbx.NewExp("stars >= {:min}", dbx.Params{"min": minStars}))
    }
    
    return dbx.And(conditions...)
}
```

### Step 3: 添加前端筛选按钮（2分钟）

**文件: `frontend/src/app/page.tsx` 或相关组件**

添加语言筛选组件：

```tsx
'use client'

import { useState } from 'react'

const LANGUAGES = ['全部', 'TypeScript', 'JavaScript', 'Go', 'Python', 'Rust', 'Vue']

export default function FilterPage() {
    const [language, setLanguage] = useState('全部')
    const [repos, setRepos] = useState([])
    
    const fetchRepos = async (lang: string) => {
        const params = new URLSearchParams({
            github_user: 'qdriven',  // 你的用户名
        })
        
        if (lang !== '全部') {
            params.append('language', lang)
        }
        
        const res = await fetch(`http://localhost:8090/api/starred/search?${params}`)
        const data = await res.json()
        setRepos(data.data)
    }
    
    return (
        <div className="p-4">
            {/* 语言筛选按钮 */}
            <div className="flex gap-2 mb-4">
                {LANGUAGES.map(lang => (
                    <button
                        key={lang}
                        onClick={() => {
                            setLanguage(lang)
                            fetchRepos(lang)
                        }}
                        className={`px-3 py-1 rounded ${
                            language === lang 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200'
                        }`}
                    >
                        {lang}
                    </button>
                ))}
            </div>
            
            {/* 结果列表 */}
            <div className="space-y-2">
                {repos.map((repo: any) => (
                    <div key={repo.name} className="p-3 border rounded">
                        <div className="flex justify-between">
                            <span className="font-bold">{repo.name}</span>
                            <span className="text-gray-500">⭐ {repo.stars}</span>
                        </div>
                        <span className="text-sm text-blue-500">{repo.language}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
```

测试：

```bash
# 启动后端
cd backend && go run main.go serve

# 启动前端
cd frontend && npm run dev

# 打开 http://localhost:3000
# 点击语言按钮测试筛选
```

搞定！

---

## Go 语言要点：这段代码教会你什么

### 1. HTTP 查询参数获取

```go
language := c.QueryParam("language")  // ?language=Go → "Go"
minStars := c.QueryParam("min_stars") // ?min_stars=100 → "100"
```

**类比**：就像 Express.js 的 `req.query.language`。

### 2. 条件构建模式

```go
conditions := []dbx.Expression{baseCondition}

if language != "" {
    conditions = append(conditions, languageCondition)
}

return dbx.And(conditions...)  // 展开切片为参数
```

**要点**：`...` 是展开操作符，把切片变成可变参数。

### 3. 动态数据库查询

```go
dbx.NewExp("language = {:lang}", dbx.Params{"lang": language})
```

**要点**：`{:lang}` 是占位符，防止 SQL 注入。

### 4. 返回 JSON 响应

```go
return c.JSON(200, map[string]interface{}{
    "count": len(results),
    "data":  results,
})
```

**要点**：`interface{}` 是 Go 的 any 类型，可以装任何数据。

---

## 你还能改成什么？

**5分钟扩展 1: 多选语言**

```go
// 支持 ?languages=Go,Python,Rust
languages := c.QueryParam("languages")
if languages != "" {
    langs := strings.Split(languages, ",")
    // 用 IN 查询
    dbx.NewExp("language IN ({:langs})", dbx.Params{"langs": langs})
}
```

**5分钟扩展 2: 按 Star 数排序**

```go
sort := c.QueryParam("sort") // "stars_desc" | "stars_asc" | "name"

orderBy := "stars DESC"
if sort == "stars_asc" {
    orderBy = "stars ASC"
}

records, _ := app.Dao().FindRecordsByExpr(
    collection,
    filter,
    dbx.OrderBy(orderBy),
)
```

**10分钟扩展 3: 分页**

```go
page := c.QueryParam("page")
perPage := 20
offset := (page - 1) * perPage

records, _ := app.Dao().FindRecordsByExpr(
    collection,
    filter,
    dbx.Limit(int64(perPage)),
    dbx.Offset(int64(offset)),
)
```

**15分钟扩展 4: 统计语言分布**

```go
// 新增 API: GET /api/stats/languages
func getLanguageStats(c echo.Context) error {
    username := c.Param("username")
    
    // 聚合查询
    result := []struct {
        Language string `db:"language"`
        Count    int    `db:"count"`
    }{}
    
    app.Dao().DB().NewQuery(
        "SELECT language, COUNT(*) as count FROM starred_repos " +
        "WHERE github_user = {:user} GROUP BY language ORDER BY count DESC",
    ).Bind(dbx.Params{"user": username}).All(&result)
    
    return c.JSON(200, result)
}
```

返回：
```json
[
  {"language": "TypeScript", "count": 150},
  {"language": "Go", "count": 80},
  {"language": "Python", "count": 45}
]
```

---

## 完整代码参考

<details>
<summary>backend/main.go（筛选相关部分）</summary>

```go
package main

import (
    "github.com/labstack/echo/v5"
    "github.com/pocketbase/dbx"
)

// 搜索 handler
func searchHandler(app core.App) echo.HandlerFunc {
    return func(c echo.Context) error {
        username := c.Param("username")
        language := c.QueryParam("language")
        minStars := c.QueryParam("min_stars")
        
        collection, _ := app.Dao().FindCollectionByNameOrId("starred_repos")
        
        // 构建查询表达式
        expr := dbx.NewExp("github_user = {:user}", dbx.Params{"user": username})
        
        if language != "" {
            expr = dbx.And(expr, dbx.NewExp("language = {:lang}", dbx.Params{"lang": language}))
        }
        
        if minStars != "" {
            expr = dbx.And(expr, dbx.NewExp("stars >= {:min}", dbx.Params{"min": minStars}))
        }
        
        records, _ := app.Dao().FindRecordsByExpr(collection, expr)
        
        // 构建响应
        results := make([]map[string]interface{}, len(records))
        for i, r := range records {
            results[i] = map[string]interface{}{
                "name":      r.GetString("name"),
                "language":  r.GetString("language"),
                "stars":     r.GetInt("stars"),
                "html_url":  r.GetString("html_url"),
                "description": r.GetString("description"),
            }
        }
        
        return c.JSON(200, map[string]interface{}{
            "count": len(results),
            "data":  results,
        })
    }
}
```

</details>

<details>
<summary>frontend/Filter.tsx（前端组件）</summary>

```tsx
'use client'

import { useState, useEffect } from 'react'

const LANGUAGES = ['全部', 'TypeScript', 'JavaScript', 'Go', 'Python', 'Rust']

export default function RepoFilter() {
    const [selectedLang, setSelectedLang] = useState('全部')
    const [repos, setRepos] = useState([])
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        fetchRepos()
    }, [selectedLang])
    
    const fetchRepos = async () => {
        setLoading(true)
        const params = new URLSearchParams({ github_user: 'qdriven' })
        if (selectedLang !== '全部') params.append('language', selectedLang)
        
        const res = await fetch(`http://localhost:8090/api/starred/search?${params}`)
        const data = await res.json()
        setRepos(data.data || [])
        setLoading(false)
    }
    
    return (
        <div>
            {/* 筛选按钮 */}
            <div className="flex flex-wrap gap-2 mb-4">
                {LANGUAGES.map(lang => (
                    <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            selectedLang === lang
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                        {lang}
                    </button>
                ))}
            </div>
            
            {/* 加载状态 */}
            {loading && <p className="text-gray-500">加载中...</p>}
            
            {/* 结果 */}
            <div className="grid gap-3">
                {repos.map((repo: any) => (
                    <a
                        key={repo.name}
                        href={repo.html_url}
                        target="_blank"
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-blue-600">{repo.name}</h3>
                            <span className="text-sm text-gray-500">⭐ {repo.stars}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {repo.description}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs rounded">
                            {repo.language}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    )
}
```

</details>

---

## 三个教程的学习路径

| 顺序 | 教程 | 学会的技能 | 难度 |
|------|------|-----------|------|
| 1 | [spark-cli-status](../spark-cli-status) | Go 结构体 + 文件遍历 | ⭐⭐ |
| 2 | [keep-them-notify](../keep-them-notify) | Go 系统命令调用 | ⭐⭐ |
| 3 | [feeds-collectors-filter](../feeds-collectors-filter) | Go HTTP API + 数据库查询 | ⭐⭐⭐ |

---

**what drives you and what you make, makes you.**

现在你不仅能收集项目，还能快速找到你需要的。
