# Stripe 支付集成配置指南

## 概述
RadioTranslator 已集成 Stripe 支付功能，支持订阅制会员服务。

## 配置步骤

### 1. 获取 Stripe API 密钥

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 注册或登录账号
3. 进入 **Developers > API keys**
4. 复制以下密钥：
   - **Publishable key** (pk_test_... 或 pk_live_...)
   - **Secret key** (sk_test_... 或 sk_live_...)

### 2. 配置后端环境变量

编辑 `/var/www/radiotranslator/.env` 文件，添加以下配置：

```bash
# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Client URL (用于支付成功/取消后的重定向)
CLIENT_URL=http://localhost:5173
```

### 3. 配置前端环境变量

创建 `/var/www/radiotranslator/client/.env` 文件：

```bash
# Stripe Publishable Key (客户端使用，可以公开)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# API Base URL
VITE_API_URL=http://localhost:3000
```

### 4. 配置 Stripe Webhook

#### 本地开发环境

1. 安装 Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.18.0/stripe_1.18.0_linux_x86_64.tar.gz
tar -xvf stripe_1.18.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

2. 登录 Stripe CLI:
```bash
stripe login
```

3. 转发 webhook 事件到本地服务器:
```bash
stripe listen --forward-to localhost:3000/api/subscriptions/webhook
```

4. 复制显示的 webhook 签名密钥 (whsec_...) 到 `.env` 文件的 `STRIPE_WEBHOOK_SECRET`

#### 生产环境

1. 访问 [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. 点击 **Add endpoint**
3. 输入 webhook URL: `https://yourdomain.com/api/subscriptions/webhook`
4. 选择以下事件：
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. 复制 **Signing secret** 到生产环境的 `.env` 文件

## API 接口说明

### 1. 获取订阅方案
```
GET /api/subscriptions/plans
```

### 2. 创建 Stripe Checkout Session
```
POST /api/subscriptions/create-checkout-session
Headers: Authorization: Bearer <token>
Body: {
  "tier": "basic" | "premium"
}
```

### 3. Webhook 处理
```
POST /api/subscriptions/webhook
Headers: stripe-signature: <signature>
```

## 支付流程

1. 用户在 Pricing 页面选择订阅方案
2. 点击"立即订阅"按钮
3. 前端调用 `/api/subscriptions/create-checkout-session` 创建支付会话
4. 用户被重定向到 Stripe Checkout 页面
5. 用户完成支付
6. Stripe 发送 webhook 到服务器
7. 服务器更新用户订阅状态
8. 用户被重定向回 Dashboard 页面

## 测试

### 测试卡号

Stripe 提供测试卡号用于开发环境：

- **成功支付**: 4242 4242 4242 4242
- **需要 3D 验证**: 4000 0027 6000 3184
- **支付失败**: 4000 0000 0000 0002

其他信息：
- CVC: 任意3位数字
- 日期: 任何未来日期
- 邮编: 任意5位数字

### 测试流程

1. 启动开发服务器:
```bash
cd /var/www/radiotranslator
npm run dev
```

2. 在另一个终端启动 Stripe CLI webhook 转发:
```bash
stripe listen --forward-to localhost:3000/api/subscriptions/webhook
```

3. 访问 http://localhost:5173/pricing
4. 登录账号
5. 选择订阅方案
6. 使用测试卡号完成支付
7. 验证订阅状态在 Dashboard 页面更新

## 数据库字段

### Users 表新增字段
- `stripeCustomerId`: Stripe 客户 ID
- `stripeSubscriptionId`: Stripe 订阅 ID

### Subscriptions 表新增字段
- `stripeSubscriptionId`: Stripe 订阅 ID
- `stripeCustomerId`: Stripe 客户 ID

## 注意事项

1. **测试模式 vs 生产模式**
   - 测试密钥以 `sk_test_` 和 `pk_test_` 开头
   - 生产密钥以 `sk_live_` 和 `pk_live_` 开头
   - 确保不要混用测试和生产密钥

2. **密钥安全**
   - 永远不要将 Secret Key 提交到版本控制
   - 只有 Publishable Key 可以在客户端使用
   - 定期更新密钥

3. **Webhook 验证**
   - Webhook 必须验证签名以确保请求来自 Stripe
   - 使用 raw body 来验证签名

4. **错误处理**
   - 支付失败时需要通知用户
   - webhook 处理失败时 Stripe 会自动重试

## 生产部署清单

- [ ] 使用生产环境的 Stripe 密钥
- [ ] 配置生产环境 webhook URL
- [ ] 更新 CLIENT_URL 为生产域名
- [ ] 启用 HTTPS
- [ ] 测试完整的支付流程
- [ ] 配置邮件通知（支付成功/失败）
- [ ] 设置订阅到期自动处理
- [ ] 监控 webhook 事件日志

## 常见问题

### Q: Webhook 没有触发？
A: 检查：
1. Stripe CLI 是否在运行
2. webhook URL 是否正确
3. 服务器是否可以访问
4. 查看 Stripe Dashboard 的 webhook 日志

### Q: 支付成功但订阅未激活？
A: 检查：
1. webhook 是否正确接收和处理
2. 数据库连接是否正常
3. 查看服务器日志的错误信息

### Q: 如何退款？
A: 访问 Stripe Dashboard > Payments，找到对应的支付记录进行退款

## 相关资源

- [Stripe 文档](https://stripe.com/docs)
- [Stripe Checkout 文档](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks 文档](https://stripe.com/docs/webhooks)
- [Stripe CLI 文档](https://stripe.com/docs/stripe-cli)
