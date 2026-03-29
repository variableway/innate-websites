---
title: "5分钟：给 spark-cli 添加仓库状态查看"
description: "copy 这个项目，添加一个实用功能，学会 Go 语言结构体和文件遍历"
type: tutorial
difficulty: beginner
time: 5min
tool: spark-cli
prerequisites: [已安装 Go]
---

## 它解决什么问题？

你有 10 个 Git 仓库，想知道哪些有未提交的代码改动，以前要逐个 `cd` 进去看。现在一键查看所有仓库状态。

## 效果预览

```bash
$ ./spark git status

✅ project-a        main      干净
⚠️  project-b        develop   有2个未提交文件
🔀 project-c        feature-x 有未推送提交
📦 project-d        main      干净
```

## 3步搞定

### Step 1: Copy 项目（1分钟）

```bash
git clone https://github.com/variableway/spark-cli.git
cd spark-cli
```

### Step 2: 修改这3处代码（2分钟）

**文件 1: `cmd/git.go`**

找到 `gitCmd` 定义的地方，在后面添加：

```go
// 添加 status 子命令
var statusCmd = &cobra.Command{
    Use:   "status",
    Short: "查看所有仓库的 Git 状态",
    Run: func(cmd *cobra.Command, args []string) {
        repos := findGitRepos(".")  // 查找当前目录下所有 git 仓库
        
        for _, repo := range repos {
            status := getRepoStatus(repo)
            printStatus(status)
        }
    },
}
```

然后在 `init()` 函数里添加：

```go
func init() {
    gitCmd.AddCommand(statusCmd)  // 把这行加在其他 AddCommand 旁边
}
```

**文件 2: `cmd/git.go` 添加辅助函数**

在文件末尾添加这两个函数：

```go
// 查找所有 Git 仓库
func findGitRepos(root string) []string {
    var repos []string
    
    filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
        if info.IsDir() && info.Name() == ".git" {
            repos = append(repos, filepath.Dir(path))
        }
        return nil
    })
    
    return repos
}

// 获取单个仓库状态
func getRepoStatus(repoPath string) RepoStatus {
    cmd := exec.Command("git", "-C", repoPath, "status", "--porcelain", "-b")
    output, _ := cmd.Output()
    
    lines := strings.Split(string(output), "\n")
    branch := "unknown"
    hasChanges := false
    
    for _, line := range lines {
        if strings.HasPrefix(line, "## ") {
            // 解析分支名
            parts := strings.Split(line[3:], "...")
            branch = parts[0]
        }
        if len(line) > 2 && (line[0] != '#' || line[1] != '#') {
            hasChanges = true
        }
    }
    
    return RepoStatus{
        Path:       repoPath,
        Branch:     branch,
        HasChanges: hasChanges,
    }
}

// 状态结构体
type RepoStatus struct {
    Path       string
    Branch     string
    HasChanges bool
}

// 打印状态
func printStatus(s RepoStatus) {
    icon := "✅"
    if s.HasChanges {
        icon = "⚠️ "
    }
    
    repoName := filepath.Base(s.Path)
    fmt.Printf("%s %-20s %-10s %s\n", icon, repoName, s.Branch, statusText(s))
}

func statusText(s RepoStatus) string {
    if s.HasChanges {
        return "有未提交改动"
    }
    return "干净"
}
```

**文件 3: 添加 import**

在文件顶部的 import 里添加：

```go
import (
    "fmt"
    "os"
    "os/exec"
    "path/filepath"
    "strings"
    
    "github.com/spf13/cobra"
)
```

### Step 3: 编译运行（2分钟）

```bash
# 编译
make build

# 测试（确保你在有多个 git 仓库的目录下）
./spark git status
```

看到输出，搞定！

---

## Go 语言要点：这段代码教会你什么

### 1. 结构体定义数据

```go
type RepoStatus struct {
    Path       string  // 仓库路径
    Branch     string  // 当前分支
    HasChanges bool    // 是否有改动
}
```

**类比**：就像 TypeScript 的 interface，但 Go 叫 struct。

### 2. 遍历文件目录

```go
filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
    // 找到 .git 目录 = 找到仓库
    if info.IsDir() && info.Name() == ".git" {
        repos = append(repos, filepath.Dir(path))
    }
    return nil
})
```

**要点**：`append` 给 slice 添加元素，类比 JavaScript 的 `push`。

### 3. 执行外部命令

```go
cmd := exec.Command("git", "-C", repoPath, "status", "--porcelain")
output, _ := cmd.Output()  // 运行命令，获取输出
```

**要点**：Go 调用系统命令很简单，`exec.Command` 就是干这个的。

### 4. 字符串处理

```go
lines := strings.Split(string(output), "\n")  // 按行分割
if strings.HasPrefix(line, "## ") {           // 检查前缀
    parts := strings.Split(line[3:], "...")   // 按 "..." 分割
}
```

**要点**：Go 的 strings 包和 JavaScript 的 string 方法类似，只是名字不同。

---

## 你还能改成什么？

**5分钟扩展 1: 显示具体的改动文件数**

```go
func getRepoStatus(repoPath string) RepoStatus {
    // ... 原有代码 ...
    
    changeCount := 0
    for _, line := range lines {
        if len(line) > 2 && line[2] != ' ' {
            changeCount++
        }
    }
    
    return RepoStatus{
        // ...
        ChangeCount: changeCount,  // 新增字段
    }
}
```

输出变成：
```
⚠️  project-b  develop  3个文件待提交
```

**5分钟扩展 2: 只显示有改动的仓库**

```go
// 在打印前加判断
for _, repo := range repos {
    status := getRepoStatus(repo)
    if !status.HasChanges {
        continue  // 跳过干净的仓库
    }
    printStatus(status)
}
```

**10分钟扩展 3: 批量执行 git pull**

```go
var pullCmd = &cobra.Command{
    Use:   "pull-all",
    Short: "批量 pull 所有仓库",
    Run: func(cmd *cobra.Command, args []string) {
        repos := findGitRepos(".")
        
        for _, repo := range repos {
            fmt.Printf("正在更新 %s...", filepath.Base(repo))
            
            exec.Command("git", "-C", repo, "pull").Run()
            
            fmt.Println("✅")
        }
    },
}
```

---

## 完整文件参考

如果你复制粘贴出错，这里是完整的 `cmd/git.go` 修改部分：

<details>
<summary>点击查看完整代码</summary>

```go
package cmd

import (
    "fmt"
    "os"
    "os/exec"
    "path/filepath"
    "strings"

    "github.com/spf13/cobra"
)

// statusCmd 查看所有仓库状态
var statusCmd = &cobra.Command{
    Use:   "status",
    Short: "查看所有仓库的 Git 状态",
    Run: func(cmd *cobra.Command, args []string) {
        repos := findGitRepos(".")
        
        fmt.Printf("找到 %d 个仓库:\n\n", len(repos))
        
        for _, repo := range repos {
            status := getRepoStatus(repo)
            printStatus(status)
        }
    },
}

// 查找所有 Git 仓库
func findGitRepos(root string) []string {
    var repos []string
    
    filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
        if err != nil {
            return nil
        }
        if info.IsDir() && info.Name() == ".git" {
            repos = append(repos, filepath.Dir(path))
        }
        return nil
    })
    
    return repos
}

// 仓库状态结构体
type RepoStatus struct {
    Path       string
    Branch     string
    HasChanges bool
}

// 获取仓库状态
func getRepoStatus(repoPath string) RepoStatus {
    cmd := exec.Command("git", "-C", repoPath, "status", "--porcelain", "-b")
    output, _ := cmd.Output()
    
    lines := strings.Split(string(output), "\n")
    branch := "unknown"
    hasChanges := false
    
    for _, line := range lines {
        if strings.HasPrefix(line, "## ") {
            parts := strings.Split(line[3:], "...")
            branch = parts[0]
        }
        if len(line) > 2 && (line[0] != '#' || line[1] != '#') {
            hasChanges = true
        }
    }
    
    return RepoStatus{
        Path:       repoPath,
        Branch:     branch,
        HasChanges: hasChanges,
    }
}

// 打印状态
func printStatus(s RepoStatus) {
    icon := "✅"
    if s.HasChanges {
        icon = "⚠️ "
    }
    
    repoName := filepath.Base(s.Path)
    status := "干净"
    if s.HasChanges {
        status = "有未提交改动"
    }
    
    fmt.Printf("%s %-20s %-10s %s\n", icon, repoName, s.Branch, status)
}

func init() {
    gitCmd.AddCommand(statusCmd)
}
```

</details>

---

## 下一步推荐

做完这个，试试：
1. **[给 keep-them 添加下载通知](../keep-them-notify)** - 学会调用系统通知
2. **[给 feeds-collectors 添加筛选](../feeds-filter)** - 学会 HTTP API 参数处理

---

**what drives you and what you make, makes you.**

今天你读了这个教程，做出了一个仓库状态查看工具。这就是 Innate 的方式。
