const express = require('express');
const { Subscription, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Get subscription plans
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'basic',
      name: '基础会员',
      price: 9.99,
      currency: 'USD',
      interval: 'month',
      features: [
        '收听所有基础电台',
        '实时字幕显示',
        '单语言翻译',
        '标清音质'
      ]
    },
    {
      id: 'premium',
      name: '高级会员',
      price: 19.99,
      currency: 'USD',
      interval: 'month',
      features: [
        '收听所有高级电台',
        '实时字幕显示',
        '多语言翻译',
        '高清音质',
        '离线下载',
        '无广告体验',
        '优先客服支持'
      ]
    }
  ];

  res.json({ plans });
});

// Get user subscriptions
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: '获取订阅信息失败' });
  }
});

// Create Stripe Checkout Session for Alipay/WeChat Pay (one-time payment)
router.post('/create-checkout-session-onetime', authenticateToken, async (req, res) => {
  try {
    const { tier, paymentMethod } = req.body;

    if (!['basic', 'premium', 'daily'].includes(tier)) {
      return res.status(400).json({ error: '无效的订阅类型' });
    }

    if (!['alipay', 'wechat_pay'].includes(paymentMethod)) {
      return res.status(400).json({ error: '无效的支付方式' });
    }

    // Pricing based on tier
    let amountCNY;
    let planName;
    let description;

    if (tier === 'daily') {
      // Daily subscription: 10 CNY per day
      amountCNY = 10;
      planName = '每日体验';
      description = '每日体验 - 1天订阅';
    } else {
      // Monthly subscriptions
      amountCNY = tier === 'basic' ? 69 : 139;
      planName = tier === 'basic' ? '基础会员' : '高级会员';
      description = `${planName} - 1个月订阅`;
    }

    // Create session config based on payment method
    const sessionConfig = {
      payment_method_types: [paymentMethod],
      line_items: [
        {
          price_data: {
            currency: 'cny', // Use CNY for Alipay and WeChat Pay
            product_data: {
              name: `RadioTranslator ${planName}`,
              description: description,
            },
            unit_amount: amountCNY * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment mode
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?payment=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing?payment=cancelled`,
      client_reference_id: req.user.id.toString(),
      metadata: {
        userId: req.user.id.toString(),
        tier: tier,
        subscriptionType: 'onetime', // Mark as one-time payment
      },
    };

    // WeChat Pay requires additional configuration
    if (paymentMethod === 'wechat_pay') {
      sessionConfig.payment_method_options = {
        wechat_pay: {
          client: 'web'
        }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create one-time checkout session error:', error);
    res.status(500).json({ error: '创建支付会话失败', details: error.message });
  }
});

// Create Stripe Checkout Session for Card (recurring subscription)
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { tier } = req.body;

    if (!['basic', 'premium'].includes(tier)) {
      return res.status(400).json({ error: '无效的订阅类型' });
    }

    const amount = tier === 'basic' ? 9.99 : 19.99;
    const planName = tier === 'basic' ? '基础会员' : '高级会员';

    // Create Stripe Checkout Session
    // Note: alipay and wechat_pay only support one-time payments, not subscriptions
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `RadioTranslator ${planName}`,
              description: `${planName} - 月度订阅`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?payment=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing?payment=cancelled`,
      client_reference_id: req.user.id.toString(),
      metadata: {
        userId: req.user.id.toString(),
        tier: tier,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: '创建支付会话失败', details: error.message });
  }
});

// Create subscription (simplified - without actual payment, for testing)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { tier } = req.body;

    if (!['basic', 'premium'].includes(tier)) {
      return res.status(400).json({ error: '无效的订阅类型' });
    }

    const amount = tier === 'basic' ? 9.99 : 19.99;
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = await Subscription.create({
      userId: req.user.id,
      tier,
      amount,
      endDate,
      status: 'active'
    });

    // Update user subscription info
    req.user.subscriptionTier = tier;
    req.user.subscriptionStatus = 'active';
    req.user.subscriptionExpiresAt = endDate;
    await req.user.save();

    res.status(201).json({
      message: '订阅成功',
      subscription
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: '订阅失败' });
  }
});

// Stripe Webhook Handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Check if it's a one-time payment or recurring subscription
        if (session.metadata.subscriptionType === 'onetime') {
          await handleOnetimePaymentCompleted(session);
        } else {
          await handleCheckoutSessionCompleted(session);
        }
        break;

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object;
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object;
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        await handleInvoicePaymentFailed(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper function to handle one-time payment completed (Alipay/WeChat Pay)
async function handleOnetimePaymentCompleted(session) {
  const userId = session.metadata.userId;
  const tier = session.metadata.tier;
  const amount = session.amount_total / 100; // Convert from cents

  const user = await User.findByPk(userId);
  if (!user) {
    console.error('User not found:', userId);
    return;
  }

  // Calculate subscription end date based on tier
  const endDate = new Date();
  if (tier === 'daily') {
    endDate.setDate(endDate.getDate() + 1); // 1 day subscription
  } else {
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
  }

  // Determine the actual subscription tier (daily users get basic features)
  const actualTier = tier === 'daily' ? 'basic' : tier;

  // Create subscription record
  await Subscription.create({
    userId: userId,
    tier: actualTier,
    amount: amount,
    endDate: endDate,
    status: 'active',
    stripeCustomerId: session.customer || null,
  });

  // Update user subscription info
  user.subscriptionTier = actualTier;
  user.subscriptionStatus = 'active';
  user.subscriptionExpiresAt = endDate;
  if (session.customer) {
    user.stripeCustomerId = session.customer;
  }
  await user.save();

  console.log('One-time payment subscription created for user:', userId);
}

// Helper function to handle completed checkout session (recurring subscription)
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const tier = session.metadata.tier;
  const amount = session.amount_total / 100; // Convert from cents

  const user = await User.findByPk(userId);
  if (!user) {
    console.error('User not found:', userId);
    return;
  }

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  // Create subscription record
  await Subscription.create({
    userId: userId,
    tier: tier,
    amount: amount,
    endDate: endDate,
    status: 'active',
    stripeSubscriptionId: session.subscription,
    stripeCustomerId: session.customer,
  });

  // Update user subscription info
  user.subscriptionTier = tier;
  user.subscriptionStatus = 'active';
  user.subscriptionExpiresAt = endDate;
  user.stripeCustomerId = session.customer;
  await user.save();

  console.log('Subscription created for user:', userId);
}

// Helper function to handle subscription update
async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({
    where: { stripeCustomerId: subscription.customer }
  });

  if (!user) {
    console.error('User not found for customer:', subscription.customer);
    return;
  }

  // Update subscription status
  user.subscriptionStatus = subscription.status;
  if (subscription.current_period_end) {
    user.subscriptionExpiresAt = new Date(subscription.current_period_end * 1000);
  }
  await user.save();

  console.log('Subscription updated for user:', user.id);
}

// Helper function to handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({
    where: { stripeCustomerId: subscription.customer }
  });

  if (!user) {
    console.error('User not found for customer:', subscription.customer);
    return;
  }

  // Update user to free tier
  user.subscriptionTier = 'free';
  user.subscriptionStatus = 'cancelled';
  await user.save();

  console.log('Subscription cancelled for user:', user.id);
}

// Helper function to handle successful payment
async function handleInvoicePaymentSucceeded(invoice) {
  const user = await User.findOne({
    where: { stripeCustomerId: invoice.customer }
  });

  if (!user) {
    console.error('User not found for customer:', invoice.customer);
    return;
  }

  console.log('Payment succeeded for user:', user.id);
}

// Helper function to handle failed payment
async function handleInvoicePaymentFailed(invoice) {
  const user = await User.findOne({
    where: { stripeCustomerId: invoice.customer }
  });

  if (!user) {
    console.error('User not found for customer:', invoice.customer);
    return;
  }

  // Optionally notify user about failed payment
  console.log('Payment failed for user:', user.id);
}

module.exports = router;
