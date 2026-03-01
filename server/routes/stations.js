const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 电台数据文件路径
const STATIONS_FILE = path.join(__dirname, '../top_stations_with_streams.json');

// 读取电台数据
function loadStations() {
  try {
    if (fs.existsSync(STATIONS_FILE)) {
      const data = fs.readFileSync(STATIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading stations:', error);
    return [];
  }
}

// GET /api/stations/streams - 获取所有电台列表
router.get('/streams', async (req, res) => {
  try {
    const stations = loadStations();

    res.json({
      success: true,
      count: stations.length,
      stations: stations
    });
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({
      success: false,
      error: '获取电台列表失败',
      stations: []
    });
  }
});

// GET /api/stations/streams/search - 搜索电台
router.get('/streams/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const stations = loadStations();

    if (!query) {
      return res.json({
        success: true,
        count: stations.length,
        stations: stations
      });
    }

    // 搜索电台名称
    const searchQuery = query.toLowerCase();
    const filteredStations = stations.filter(station =>
      station.name.toLowerCase().includes(searchQuery) ||
      station.id.toLowerCase().includes(searchQuery)
    );

    res.json({
      success: true,
      count: filteredStations.length,
      stations: filteredStations
    });
  } catch (error) {
    console.error('Search stations error:', error);
    res.status(500).json({
      success: false,
      error: '搜索电台失败',
      stations: []
    });
  }
});

// GET /api/stations/streams/:id - 获取指定电台信息
router.get('/streams/:id', async (req, res) => {
  try {
    const stationId = req.params.id;
    const stations = loadStations();

    const station = stations.find(s => s.id === stationId);

    if (!station) {
      return res.status(404).json({
        success: false,
        error: '电台不存在'
      });
    }

    res.json({
      success: true,
      station: station
    });
  } catch (error) {
    console.error('Get station error:', error);
    res.status(500).json({
      success: false,
      error: '获取电台信息失败'
    });
  }
});

module.exports = router;
