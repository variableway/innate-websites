---
title: "5分钟：给 keep-them 添加下载完成通知"
description: "copy 这个项目，添加 macOS 下载通知，学会 Go 调用系统命令"
type: tutorial
difficulty: beginner
time: 5min
tool: keep-them
prerequisites: [已安装 Go, 已安装 yt-dlp]
---

## 它解决什么问题？

下载 YouTube 视频要等几分钟，你不知道什么时候下完。添加系统通知，下载完成自动弹窗提醒。

## 效果预览

下载完成后自动弹出：

```
┌─────────────────────────┐
│ 🎉 下载完成              │
│ 《视频标题》已保存       │
└─────────────────────────┘
```

## 3步搞定

### Step 1: Copy 项目（1分钟）

```bash
git clone https://github.com/variableway/keep-them.git
cd keep-them
```

### Step 2: 添加通知代码（2分钟）

**找到下载完成的代码位置**

在 `internal/downloader/downloader.go` 或 `cmd/download.go` 中找到下载完成的逻辑（搜索 `Download completed` 或看最后的输出语句）。

**添加通知函数**

在文件末尾添加：

```go
// sendNotification 发送系统通知
func sendNotification(title, message string) error {
    // macOS 使用 osascript
    script := fmt.Sprintf(`display notification "%s" with title "%s"`, message, title)
    cmd := exec.Command("osascript", "-e", script)
    return cmd.Run()
}

// Linux 版本（备用）
func sendNotificationLinux(title, message string) error {
    cmd := exec.Command("notify-send", title, message)
    return cmd.Run()
}
```

**在下载完成处调用**

找到下载完成的代码位置，添加：

```go
// 下载完成后
fmt.Println("✅ Download completed:", video.Title)

// 发送通知
if err := sendNotification("🎉 下载完成", video.Title); err != nil {
    // 静默失败，不影响主流程
    log.Println("通知发送失败:", err)
}
```

**添加 import**

```go
import (
    "fmt"
    "os/exec"
    "log"
)
```

### Step 3: 编译测试（2分钟）

```bash
go build -o vYtDL .

# 下载一个短视频测试
./vYtDL download --no-tui "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# 等待下载完成，看到系统通知弹出
```

搞定！

---

## Go 语言要点：这段代码教会你什么

### 1. 调用系统命令

```go
cmd := exec.Command("osascript", "-e", script)
return cmd.Run()
```

**要点**：Go 通过 `exec.Command` 调用任何系统命令，就像你在终端里敲的一样。

### 2. 格式化字符串

```go
script := fmt.Sprintf(`display notification "%s" with title "%s"`, message, title)
```

**要点**：`fmt.Sprintf` 类似 JavaScript 的模板字符串，用 `%s` 占位。

### 3. 错误处理但不中断

```go
if err := sendNotification(...); err != nil {
    log.Println("通知发送失败:", err)  // 记录但继续
}
```

**要点**：通知失败不应该导致下载失败，所以只记录不返回错误。

### 4. 跨平台考虑

```go
// 根据系统选择通知方式
func sendNotification(title, message string) {
    switch runtime.GOOS {
    case "darwin":
        sendMacNotification(title, message)
    case "linux":
        sendLinuxNotification(title, message)
    default:
        // Windows 可以用 msg 命令或其他库
    }
}
```

---

## 你还能改成什么？

**5分钟扩展 1: 下载进度通知**

```go
// 每下载 25% 发一次通知
func onProgress(percent int) {
    if percent%25 == 0 {
        sendNotification("📥 下载进度", fmt.Sprintf("已完成 %d%%", percent))
    }
}
```

**5分钟扩展 2: 播放列表批量通知**

```go
// 播放列表全部完成后通知
totalVideos := len(playlist.Videos)
completed := 0

for _, video := range playlist.Videos {
    download(video)
    completed++
    
    if completed == totalVideos {
        sendNotification(
            "🎉 全部完成", 
            fmt.Sprintf("%d 个视频下载完成", totalVideos),
        )
    }
}
```

**10分钟扩展 3: 下载失败也通知**

```go
if err := download(video); err != nil {
    sendNotification("❌ 下载失败", video.Title)
    log.Println("下载失败:", err)
    continue
}
```

**15分钟扩展 4: 支持 Sound 提示**

```go
func sendNotificationWithSound(title, message string) {
    script := fmt.Sprintf(
        `display notification "%s" with title "%s" sound name "Glass"`,
        message, title,
    )
    exec.Command("osascript", "-e", script).Run()
}
```

---

## Windows 用户适配

Windows 可以用 `msg` 命令或 PowerShell：

```go
func sendWindowsNotification(title, message string) error {
    // 方法 1: msg 命令（简单）
    cmd := exec.Command("msg", "*", fmt.Sprintf("%s: %s", title, message))
    
    // 方法 2: PowerShell 弹窗（美观）
    psScript := fmt.Sprintf(
        `Add-Type -AssemblyName System.Windows.Forms; `+
        `[System.Windows.Forms.MessageBox]::Show("%s", "%s")`,
        message, title,
    )
    cmd := exec.Command("powershell", "-c", psScript)
    
    return cmd.Run()
}
```

---

## 完整代码参考

<details>
<summary>notify.go（完整文件）</summary>

```go
package main

import (
    "fmt"
    "log"
    "os/exec"
    "runtime"
)

// Notify 发送系统通知
func Notify(title, message string) {
    var err error
    
    switch runtime.GOOS {
    case "darwin":
        err = notifyMac(title, message)
    case "linux":
        err = notifyLinux(title, message)
    default:
        log.Println("不支持的通知系统")
        return
    }
    
    if err != nil {
        log.Println("通知失败:", err)
    }
}

func notifyMac(title, message string) error {
    script := fmt.Sprintf(
        `display notification "%s" with title "%s"`,
        message, title,
    )
    return exec.Command("osascript", "-e", script).Run()
}

func notifyLinux(title, message string) error {
    return exec.Command("notify-send", title, message).Run()
}

// 使用示例
func main() {
    Notify("🎉 下载完成", "你的视频已保存")
}
```

</details>

---

## 下一步推荐

做完这个，试试：
1. **[给 spark-cli 添加仓库状态](../spark-cli-status)** - 学会 Go 结构体
2. **[给 feeds-collectors 添加筛选](../feeds-filter)** - 学会 HTTP API

---

**what drives you and what you make, makes you.**

现在你下载视频不用守着看了，去做别的，它会叫你。
