# Task 1: Content Enhance

目前所有的Markdown文本没有展示比较好：
1. Project中比如AGENTS.md 原文
2. 做什么中Issue的描述，也是直接展示的Markdown文件原文
3. 同时Issues中拉的内容只有第一条，目前需要展示前两条Issue的数据，因为第二条正好的AI执行的描述，如果没有第二条，就只展示第一条Issue的数据，但是都是在做什么的一条中展示
4. 目前Markdown文件的展示，需要把Markdown文件的内容展示出来，使用HTML的方式展示，也就是说需要Parse一下，而不是直接展示Markdown文件的原文

## Task 2:

fix issue：

```
Import trace:
  Server Component:
    [next]/internal/font/google/geist_mono_354fc78.module.css
    [next]/internal/font/google/geist_mono_354fc78.js
    ./apps/web/app/layout.tsx


[browser] Uncaught Error: [next]/internal/font/google/geist_a7695b8e.module.css:16:8
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
  14 |   font-weight: 100 900;
  15 |   font-display: swap;
> 16 |   src: url(@vercel/turbopack-next/internal/font/google/font?{%22url%22:%22https://fonts.gstatic.com/s/geist/v...
     |        ^
  17 |   unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1...
  18 | }
  19 | /* latin */

Import map: Resolved by import map


Import trace:
  Server Component:
    [next]/internal/font/google/geist_a7695b8e.module.css
    [next]/internal/font/google/geist_a7695b8e.js
    ./apps/web/app/layout.tsx

https://nextjs.org/docs/messages/module-not-found


    at <unknown> (Error: [next]/internal/font/google/geist_a7695b8e.module.css:16:8)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
    at <unknown> (Error: ([next]/internal/font/google/geist_a7695b8e.module.css:16:8)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
[browser] [next]/internal/font/google/geist_a7695b8e.module.css:16:8
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
  14 |   font-weight: 100 900;
  15 |   font-display: swap;
> 16 |   src: url(@vercel/turbopack-next/internal/font/google/font?{%22url%22:%22https://fonts.gstatic.com/s/geist/v...
     |        ^
  17 |   unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1...
  18 | }
  19 | /* latin */

Import map: Resolved by import map

Import trace:
  Server Component:
    [next]/internal/font/google/geist_a7695b8e.module.css
    [next]/internal/font/google/geist_a7695b8e.js
    ./apps/web/app/layout.tsx

https://nextjs.org/docs/messages/module-not-found 
[browser] [next]/internal/font/google/geist_a7695b8e.module.css:16:8
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
  14 |   font-weight: 100 900;
  15 |   font-display: swap;
> 16 |   src: url(@vercel/turbopack-next/internal/font/google/font?{%22url%22:%22https://fonts.gstatic.com/s/geist/v...
     |        ^
  17 |   unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1...
  18 | }
  19 | /* latin */

Import map: Resolved by import map

Import trace:
  Server Component:
    [next]/internal/font/google/geist_a7695b8e.module.css
    [next]/internal/font/google/geist_a7695b8e.js
    ./apps/web/app/layout.tsx

https://nextjs.org/docs/messages/module-not-found 
[browser] [next]/internal/font/google/geist_a7695b8e.module.css:16:8
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
  14 |   font-weight: 100 900;
  15 |   font-display: swap;
> 16 |   src: url(@vercel/turbopack-next/internal/font/google/font?{%22url%22:%22https://fonts.gstatic.com/s/geist/v...
     |        ^
  17 |   unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1...
  18 | }
  19 | /* latin */

Import map: Resolved by import map

Import trace:
  Server Component:
    [next]/internal/font/google/geist_a7695b8e.module.css
    [next]/internal/font/google/geist_a7695b8e.js
    ./apps/web/app/layout.tsx

https://nextjs.org/docs/messages/module-not-found 
```

## Task 2: Fix Font Download issue

看起啦问题是网络不能download google font，请找其他办法修复，下载到本地都可以。

```

⚠ [next]/internal/font/google/geist_mono_354fc78.module.css
next/font: warning:
Failed to download `Geist Mono` from Google Fonts. Using fallback font instead.

Import trace:
  Server Component:
    [next]/internal/font/google/geist_mono_354fc78.module.css
    [next]/internal/font/google/geist_mono_354fc78.js
    ./apps/web/app/layout.tsx


[browser] Uncaught Error: [next]/internal/font/google/geist_a7695b8e.module.css:16:8
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
  14 |   font-weight: 100 900;
  15 |   font-display: swap;
> 16 |   src: url(@vercel/turbopack-next/internal/font/google/font?{%22url%22:%22https://fonts.gstatic.com/s/geist/v...
     |        ^
  17 |   unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1...
  18 | }
  19 | /* latin */

Import map: Resolved by import map


Import trace:
  Server Component:
    [next]/internal/font/google/geist_a7695b8e.module.css
    [next]/internal/font/google/geist_a7695b8e.js
    ./apps/web/app/layout.tsx

https://nextjs.org/docs/messages/module-not-found


    at <unknown> (Error: [next]/internal/font/google/geist_a7695b8e.module.css:16:8)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
    at <unknown> (Error: ([next]/internal/font/google/geist_a7695b8e.module.css:16:8)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
[browser] [next]/internal/font/google/geist_a7695b8e.module.css:16:8
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
  14 |   font-weight: 100 900;
  15 |   font-display: swap;
> 16 |   src: url(@vercel/turbopack-next/internal/font/google/font?{%22url%22:%22https://fonts.gstatic.com/s/geist/v...
     |        ^
  17 |   unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1...
  18 | }
  19 | /* latin */

Import map: Resolved by import map

Import trace:
  Server Component:
    [next]/internal/font/google/geist_a7695b8e.module.css
    [next]/internal/font/google/geist_a7695b8e.js
    ./apps/web/app/layout.tsx

https://nextjs.org/docs/messages/module-not-found 
[browser] [next]/internal/font/google/geist_a7695b8e.module.css:16:8
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
  14 |   font-weight: 100 900;
  15 |   font-display: swap;
> 16 |   src: url(@vercel/turbopack-next/internal/font/google/font?{%22url%22:%22https://fonts.gstatic.com/s/geist/v...
     |        ^
  17 |   unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1...
  18 | }
  19 | /* latin */

Import map: Resolved by import map

Import trace:
  Server Component:
    [next]/internal/font/google/geist_a7695b8e.module.css
    [next]/internal/font/google/geist_a7695b8e.js
    ./apps/web/app/layout.tsx

https://nextjs.org/docs/messages/module-not-found 
[browser] [next]/internal/font/google/geist_a7695b8e.module.css:16:8
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
  14 |   font-weight: 100 900;
  15 |   font-display: swap;
> 16 |   src: url(@vercel/turbopack-next/internal/font/google/font?{%22url%22:%22https://fonts.gstatic.com/s/geist/v...
     |        ^
  17 |   unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1...
  18 | }
  19 | /* latin */

Import map: Resolved by import map

Import trace:
  Server Component:
    [next]/internal/font/google/geist_a7695b8e.module.css
    [next]/internal/font/google/geist_a7695b8e.js
    ./apps/web/app/layout.tsx

https://nextjs.org/docs/messages/module-not-found 
 GET / 200 in 1768ms (next.js: 786ms, application-code: 983ms)
Persisting failed: Unable to write SST file 00000059.sst

Caused by:
    No such file or directory (os error 2)
Compaction failed: Another write batch or compaction is already active (Only a single write operations is allowed at a time)
⨯ Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages-manifest.json',
  page: '/making'
}
⨯ Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
}
Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages-manifest.json',
  page: '/making'
}
⨯ Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
}
Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
}
 GET /making 500 in 2.9s
 GET /making 500 in 2.9s
⨯ Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages-manifest.json',
  page: '/making'
}
⨯ Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
}
Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages-manifest.json',
  page: '/making'
}
⨯ Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
}
Error: ENOENT: no such file or directory, open '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
    at ignore-listed frames {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/patrick/workspace/variableway/innate/innate-websites/apps/web/dist/dev/server/pages/_app/build-manifest.json'
}
 GET /making 500 in 324ms
 GET /making 500 in 325ms
```

## Task 4: Enhance Markdown Content

![alt text](image-1.png)
如截图，description部分的Markdown 解析还是有问题，这个页面需要把Issue 内容也用Markdown形式展现出来，
同样的Project模块的Agents.md部分和这个一样，也需要修复，都需要用Markdown渲染出来，同时如果一些图表不支持，需要用组件支持，尤其是架构图这样的，请修复这个问题

![alt text](image-2.png)  这个截图是Agents.md部分展示

## Task 5: Issues内容还是这样第一条，需要去前两条，合并展示

1. Issues内容还是这样第一条，需要去前两条，合并展示
2. 如果去的数据是两条了，那么可能是老数据问题，请删除老数据用全新的数据


## Task 6: Fix Bug
1. 修复这个问题：

```
Module not found: Can't resolve 'mermaid'
  53 |       try {
  54 |         // Dynamically import mermaid - may fail if not installed
> 55 |         const mermaidModule = await import('mermaid').catch(() => null)
     |                                     ^^^^^^^^^^^^^^^^^
  56 |         if (!mermaidModule) {
  57 |           // Mermaid not installed, show code block as preformatted text
  58 |           mermaidBlocks.forEach((block) => {



Import traces:
  Client Component Browser:
    ./apps/web/components/markdown-renderer.tsx [Client Component Browser]
    ./apps/web/app/making/issues/page.tsx [Client Component Browser]
    ./apps/web/app/making/issues/page.tsx [Server Component]

  Client Component SSR:
    ./apps/web/components/markdown-renderer.tsx [Client Component SSR]
    ./apps/web/app/making/issues/page.tsx [Client Component SSR]
    ./apps/web/app/making/issues/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found


 GET /making/projects 200 in 74ms (next.js: 38ms, application-code: 36ms)
```
2. 考虑到当前可能是部署github pages的，server components可以使用吗？
3. 当前Markdown的渲染还是很成问题，是否有其他成熟的办法，比如Issue内容可以完全用Markdown渲染出来，不需要加上什么description这个东西 Header的，是不是更容易处理？直接Issue的内容通过Markdown渲染，或者static 文件generate呢？请分析给出解决方案，同样Agents.md的页面也是一样的
