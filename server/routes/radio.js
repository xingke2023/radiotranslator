const express = require('express');
const { Radio } = require('../models');
const router = express.Router();

// Get all radios
router.get('/', async (req, res) => {
  try {
    const radios = await Radio.findAll({
      where: { isActive: true },
      order: [['listenerCount', 'DESC']]
    });

    res.json({ radios });
  } catch (error) {
    console.error('Get radios error:', error);
    res.status(500).json({ error: '获取电台列表失败' });
  }
});

// Get radio by ID
router.get('/:id', async (req, res) => {
  try {
    const radio = await Radio.findByPk(req.params.id);

    if (!radio) {
      return res.status(404).json({ error: '电台不存在' });
    }

    res.json({ radio });
  } catch (error) {
    console.error('Get radio error:', error);
    res.status(500).json({ error: '获取电台信息失败' });
  }
});

module.exports = router;
