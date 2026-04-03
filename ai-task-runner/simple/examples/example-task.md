---
id: "tr-20260401-104530-a3f9"
meta:
  title: "实现用户认证系统"
  description: "基于 JWT 的用户认证和授权功能"
  priority: high
  labels: ["feature", "auth", "backend"]
status: in_progress
createdAt: "2026-04-01T10:45:30Z"
updatedAt: "2026-04-01T14:20:00Z"
completedAt: null
github:
  number: 42
  url: "https://github.com/org/repo/issues/42"
  state: open
git:
  branch: "ai-task/tr-20260401-104530-a3f9"
  baseBranch: "main"
---

## 原始需求

实现一个完整的用户认证系统，支持：
1. 用户注册（邮箱 + 密码）
2. 用户登录
3. JWT Token 生成和验证
4. Token 刷新机制
5. 密码重置功能

## AI 分析

### 复杂度评估
**等级**: medium-high

**预估工时**: 6-8 小时

### 影响范围

**文件**: 
- `src/auth/*.ts` - 认证相关模块
- `src/middleware/auth.ts` - 认证中间件
- `src/routes/auth.ts` - 认证路由
- `src/models/user.ts` - 用户模型
- `prisma/schema.prisma` - 数据库 schema

**模块**:
- auth - 认证核心
- user - 用户管理
- middleware - 中间件层

**APIs**:
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/refresh` - Token 刷新
- `POST /auth/forgot-password` - 密码重置请求
- `POST /auth/reset-password` - 密码重置确认

### 风险评估

1. **high** - Token 泄露风险
   - **缓解措施**: 
     - 设置短有效期（access token: 15min, refresh token: 7d）
     - 实现 Token 黑名单机制
     - 使用 HTTPS

2. **medium** - 密码安全
   - **缓解措施**:
     - 使用 bcrypt 进行密码加密（salt rounds: 12）
     - 密码复杂度验证
     - 防止暴力破解（rate limiting）

3. **medium** - 数据库迁移
   - **缓解措施**:
     - 创建迁移文件前备份数据
     - 测试迁移回滚

## 执行计划

### 方案概述

采用 JWT（JSON Web Token）实现无状态认证：
- Access Token: 短期有效，包含用户基本信息
- Refresh Token: 长期有效，用于获取新的 Access Token
- 使用 Redis 存储 Token 黑名单

### 备选方案

- **Session + Cookie**: 有状态，不适合分布式部署（放弃）
- **OAuth 2.0**: 适合第三方登录，当前需求不需要（放弃）
- **Auth0**: 成本较高，增加外部依赖（放弃）

### 实施步骤

1. **数据库设计** (45min)
   - 设计 User 表结构
   - 创建 Prisma schema
   - 生成并执行迁移

2. **密码工具** (30min)
   - 实现 hashPassword 函数
   - 实现 verifyPassword 函数
   - 编写单元测试

3. **JWT 工具** (45min)
   - 实现 generateToken 函数
   - 实现 verifyToken 函数
   - 实现 refreshToken 函数
   - 配置密钥管理

4. **注册 API** (60min)
   - 实现注册路由
   - 添加验证逻辑
   - 编写集成测试

5. **登录 API** (45min)
   - 实现登录路由
   - 添加错误处理
   - 编写集成测试

6. **认证中间件** (60min)
   - 实现 requireAuth 中间件
   - 实现 optionalAuth 中间件
   - 添加错误处理

7. **Token 刷新** (30min)
   - 实现刷新路由
   - 验证 Refresh Token

8. **密码重置** (60min)
   - 实现重置请求（发送邮件）
   - 实现重置确认

9. **集成测试** (60min)
   - 编写端到端测试
   - 测试各种边界情况

### 测试策略

- **单元测试**: 所有工具函数（密码、JWT）
- **集成测试**: 所有 API 端点
- **端到端测试**: 完整用户流程
- **工具**: Jest + Supertest

## 子任务

- [x] 1. 创建数据库模型和迁移
- [x] 2. 实现密码加密工具
- [x] 3. 实现 JWT 生成和验证工具
- [ ] 4. 实现用户注册 API
- [ ] 5. 实现用户登录 API
- [ ] 6. 实现认证中间件
- [ ] 7. 实现 Token 刷新 API
- [ ] 8. 实现密码重置功能
- [ ] 9. 编写集成测试

## 执行笔记

### 2026-04-01 11:30 - 数据库设计完成

完成了 Prisma schema 设计：

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([token])
  @@index([userId])
}
```

运行了迁移：
```bash
npx prisma migrate dev --name add_auth_tables
```

遇到的问题：
- 最初考虑使用 `cuid`，后改为 `uuid` 以更好兼容

### 2026-04-01 12:30 - 密码工具完成

使用 bcrypt 实现：
- `hashPassword`: 使用 salt rounds 12
- `verifyPassword`: 使用 bcrypt.compare

测试覆盖 100%，包括：
- 正常哈希和验证
- 错误密码验证失败
- 哈希值不为明文

### 2026-04-01 14:20 - JWT 工具完成

使用 jsonwebtoken 库：
- Access Token: 15 分钟有效期
- Refresh Token: 7 天有效期

密钥管理：
- 从环境变量读取 `JWT_SECRET` 和 `JWT_REFRESH_SECRET`
- 提供默认值用于开发环境

下一步：开始实现注册 API

## 参考资料

- [JWT 最佳实践](https://example.com/jwt-best-practices)
- [bcrypt 文档](https://www.npmjs.com/package/bcrypt)
- [Prisma 迁移指南](https://prisma.io/docs/guides/migrate)
