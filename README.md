# RadioTranslator

电台实时收听、字幕显示和多语言翻译平台门户网站

## 项目简介

RadioTranslator 是一个现代化的电台翻译服务门户网站，提供用户注册、会员订阅和功能展示等核心功能。

## 主要功能

- 🎧 **实时电台收听** - 介绍全球 1000+ 优质电台
- 📝 **实时字幕生成** - AI 驱动的语音识别技术展示
- 🌐 **多语言翻译** - 支持 50+ 语言实时翻译功能介绍
- ⭐ **会员专区** - 会员订阅和权益管理
- 👤 **用户系统** - 完整的注册、登录、认证系统

## 技术栈

### 后端
- Node.js + Express
- MySQL + Sequelize ORM
- JWT 认证
- Socket.io (实时通信)
- bcryptjs (密码加密)

### 前端
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Vite

## 项目结构

```
radiotranslator/
├── server/                 # 后端代码
│   ├── index.js           # 服务器入口
│   ├── database/          # 数据库配置
│   ├── models/            # 数据模型
│   ├── routes/            # API 路由
│   └── middleware/        # 中间件
├── client/                # 前端代码
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── pages/        # 页面组件
│   │   ├── context/      # Context API
│   │   ├── App.jsx       # 主应用
│   │   └── main.jsx      # 入口文件
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
└── .env.example
```

## 快速开始

### 环境要求

- Node.js >= 16.x
- MySQL >= 5.7

### 安装步骤

1. **克隆项目**
```bash
cd /var/www/radiotranslator
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

3. **安装后端依赖**
```bash
npm install
```

4. **安装前端依赖**
```bash
cd client
npm install
cd ..
```

5. **配置数据库**

创建 MySQL 数据库：
```sql
CREATE DATABASE radiotranslator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

更新 `.env` 文件中的数据库配置：
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=radiotranslator
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

6. **启动开发服务器**

同时启动前后端：
```bash
npm run dev
```

或分别启动：

后端（端口 3000）：
```bash
npm run server:dev
```

前端（端口 5173）：
```bash
npm run client:dev
```

7. **访问应用**

打开浏览器访问：http://localhost:5173

## API 文档

### 认证相关

#### 注册
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

#### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 用户相关

#### 获取当前用户信息
```
GET /api/users/me
Authorization: Bearer <token>
```

#### 更新用户信息
```
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "preferredLanguage": "zh"
}
```

### 订阅相关

#### 获取订阅方案
```
GET /api/subscriptions/plans
```

#### 创建订阅
```
POST /api/subscriptions/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "tier": "basic" | "premium"
}
```

#### 获取我的订阅
```
GET /api/subscriptions/my
Authorization: Bearer <token>
```

### 电台相关

#### 获取所有电台
```
GET /api/radio
```

#### 获取电台详情
```
GET /api/radio/:id
```

## 页面路由

- `/` - 首页
- `/features` - 功能介绍
- `/pricing` - 会员订阅
- `/login` - 登录
- `/register` - 注册
- `/dashboard` - 会员专区（需登录）

## 数据库模型

### Users (用户表)
- id, email, password, username
- subscriptionTier, subscriptionStatus, subscriptionExpiresAt
- stripeCustomerId, stripeSubscriptionId
- preferredLanguage

### Radios (电台表)
- id, name, description, streamUrl, logo
- country, language, category
- isActive, requiresSubscription, subscriptionTier
- listenerCount

### Subscriptions (订阅表)
- id, userId, tier, status
- startDate, endDate
- stripeSubscriptionId, amount, currency
- autoRenew

### Translations (翻译记录表)
- id, radioId, originalText, translatedText
- sourceLanguage, targetLanguage, timestamp

## 开发说明

### 启动方式

开发模式（热重载）：
```bash
npm run dev
```

仅后端：
```bash
npm run server:dev
```

仅前端：
```bash
npm run client:dev
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 环境变量说明

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=radiotranslator
DB_USER=root
DB_PASSWORD=

# JWT 密钥
JWT_SECRET=your-secret-key

# API 密钥（可选）
OPENAI_API_KEY=your-openai-api-key
DEEPL_API_KEY=your-deepl-api-key

# Stripe 支付（可选）
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 功能特性

### 已实现功能
- ✅ 用户注册和登录
- ✅ JWT 认证系统
- ✅ 会员订阅系统
- ✅ 响应式设计（Tailwind CSS）
- ✅ 用户个人中心
- ✅ 功能展示页面
- ✅ 价格方案展示

### 待扩展功能
- 🔄 实际支付集成（Stripe）
- 🔄 邮件验证系统
- 🔄 密码重置功能
- 🔄 社交登录
- 🔄 管理后台
- 🔄 实时电台流媒体播放
- 🔄 实时字幕和翻译功能

## 部署

### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server/index.js --name radiotranslator

# 查看日志
pm2 logs radiotranslator

# 重启应用
pm2 restart radiotranslator
```

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题，请联系：support@radiotranslator.com

---

**注意**：这是一个门户网站项目，主要用于展示和用户管理。实时收听、字幕和翻译功能需要额外的后端服务支持。
