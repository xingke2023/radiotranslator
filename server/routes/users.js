const express = require('express');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { username, preferredLanguage } = req.body;

    if (username) req.user.username = username;
    if (preferredLanguage) req.user.preferredLanguage = preferredLanguage;

    await req.user.save();

    res.json({
      message: '更新成功',
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: '更新失败' });
  }
});

// Delete user account
router.delete('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete the user account
    await req.user.destroy();

    res.json({
      message: '账户已成功注销'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: '账户注销失败' });
  }
});

module.exports = router;
