const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const requireSubscription = (requiredTier = 'basic') => {
  return async (req, res, next) => {
    try {
      if (!req.user.subscriptionStatus || req.user.subscriptionStatus === 'inactive') {
        return res.status(403).json({ error: 'Active subscription required' });
      }

      if (req.user.subscriptionExpiresAt && new Date(req.user.subscriptionExpiresAt) < new Date()) {
        return res.status(403).json({ error: 'Subscription expired' });
      }

      const tierLevels = { basic: 1, premium: 2 };
      const userTierLevel = tierLevels[req.user.subscriptionTier] || 0;
      const requiredTierLevel = tierLevels[requiredTier] || 0;

      if (userTierLevel < requiredTierLevel) {
        return res.status(403).json({
          error: `${requiredTier} subscription required`,
          currentTier: req.user.subscriptionTier
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Authentication error' });
    }
  };
};

module.exports = { authenticateToken, requireSubscription };
