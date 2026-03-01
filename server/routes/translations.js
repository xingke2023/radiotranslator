const express = require('express');
const { Translation } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get translations for a radio station
router.get('/radio/:radioId', authenticateToken, async (req, res) => {
  try {
    const { radioId } = req.params;
    const { limit = 50 } = req.query;

    const translations = await Translation.findAll({
      where: { radioId },
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ translations });
  } catch (error) {
    console.error('Get translations error:', error);
    res.status(500).json({ error: '获取翻译记录失败' });
  }
});

module.exports = router;
