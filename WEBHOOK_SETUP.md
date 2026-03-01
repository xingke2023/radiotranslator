# Stripe Webhook 配置指南

## 当前配置状态

✅ Stripe 生产环境密钥已配置
✅ CLIENT_URL 已设置为: https://www.radiotranslator.com
⚠️ **需要配置 Webhook Secret**

## 配置步骤

### 1. 登录 Stripe Dashboard
访问：https://dashboard.stripe.com/webhooks

### 2. 添加 Webhook Endpoint
点击 **"Add endpoint"** 按钮

### 3. 配置 Endpoint URL
输入以下 URL：
```
https://www.radiotranslator.com/api/subscriptions/webhook
```

### 4. 选择监听事件
勾选以下事件（非常重要）：

- ✅ `checkout.session.completed` - 支付完成
- ✅ `customer.subscription.updated` - 订阅更新
- ✅ `customer.subscription.deleted` - 订阅取消
- ✅ `invoice.payment_succeeded` - 支付成功
- ✅ `invoice.payment_failed` - 支付失败

### 5. 保存并获取 Signing Secret
点击 **"Add endpoint"** 保存后，你会看到一个 **Signing secret**，格式类似：
```
whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 6. 更新服务器配置
将获取到的 Signing Secret 添加到服务器：

```bash
# 编辑 .env 文件
nano /var/www/radiotranslator/.env

# 找到这一行并添加你的 webhook secret
STRIPE_WEBHOOK_SECRET=whsec_你的密钥

# 保存后重启服务器
pm2 restart radiotranslator --update-env
```

### 7. 测试 Webhook
在 Stripe Dashboard 的 Webhook 页面，点击你刚创建的 endpoint，然后点击 **"Send test webhook"** 进行测试。

## 支付流程说明

1. 用户在 https://www.radiotranslator.com/pricing 选择套餐
2. 点击"立即订阅"
3. 跳转到 Stripe 托管的支付页面
4. 用户完成支付
5. Stripe 发送 webhook 到你的服务器
6. 服务器验证 webhook 签名（使用 STRIPE_WEBHOOK_SECRET）
7. 更新数据库中的用户订阅状态
8. 用户被重定向到 https://www.radiotranslator.com/dashboard?payment=success

## 重定向 URL
系统已配置以下重定向 URL：

- **支付成功**: https://www.radiotranslator.com/dashboard?payment=success
- **支付取消**: https://www.radiotranslator.com/pricing?payment=cancelled

## 安全说明

⚠️ **非常重要**：
- Webhook Secret 用于验证请求确实来自 Stripe
- 没有配置 Webhook Secret，服务器会拒绝所有 webhook 请求
- 请妥善保管此密钥，不要提交到代码仓库

## 测试支付

配置完成后，你可以使用 Stripe 提供的测试卡号进行测试：
- **卡号**: 4242 4242 4242 4242
- **到期日期**: 任意未来日期
- **CVC**: 任意3位数字
- **邮编**: 任意5位数字

## 查看日志

监控 webhook 事件：
```bash
# 查看服务器日志
pm2 logs radiotranslator

# 查看 Stripe Dashboard 中的 webhook 日志
# https://dashboard.stripe.com/webhooks
```

## 故障排除

### Webhook 请求失败
1. 检查 URL 是否正确：https://www.radiotranslator.com/api/subscriptions/webhook
2. 确认服务器防火墙允许 Stripe IP 访问
3. 查看 Stripe Dashboard 的 webhook 日志获取错误详情

### 签名验证失败
1. 确认 STRIPE_WEBHOOK_SECRET 配置正确
2. 重启服务器：`pm2 restart radiotranslator --update-env`
3. 检查服务器日志：`pm2 logs radiotranslator`

### 支付成功但订阅未激活
1. 检查 webhook 是否正确接收（查看 Stripe Dashboard）
2. 检查服务器日志是否有错误
3. 确认数据库连接正常

## 当前环境变量

```bash
NODE_ENV=production
CLIENT_URL=https://www.radiotranslator.com
STRIPE_SECRET_KEY=sk_live_51SSRX8Ew3cJeoZkR... (已配置)
STRIPE_PUBLISHABLE_KEY=pk_live_51SSRX8Ew3cJeoZkR... (已配置)
STRIPE_WEBHOOK_SECRET=(待配置)
```

## 下一步

1. ☑️ 访问 https://dashboard.stripe.com/webhooks
2. ☑️ 添加 webhook endpoint
3. ☑️ 复制 Signing Secret
4. ☑️ 更新 .env 文件
5. ☑️ 重启服务器
6. ☑️ 测试支付流程

完成以上步骤后，Stripe 支付功能将完全可用！
