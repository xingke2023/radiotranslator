# 爬取 Top Stations 功能使用指南

## 功能说明

已成功添加爬取 `https://www.radio.net/top-stations` 页面的功能。该功能可以：
- 抓取热门电台列表（98个电台）
- 获取每个电台的详细信息（名称、ID、Logo、描述、位置）
- 提取音频流媒体链接（支持 .m3u8、.mp3、.aac 等格式）

## API 端点

### 1. 获取热门电台列表

**请求：**
```bash
GET http://localhost:8405/api/top-stations
```

**响应示例：**
```json
{
  "success": true,
  "count": 98,
  "data": [
    {
      "id": "wfan",
      "name": "Listen to the station WFAN 66 AM - 101.9 FM online now",
      "url": "https://www.radio.net/s/wfan",
      "logo": "https://www.radio.net/100/wfan.jpeg?version=e92e98f403243ecc",
      "description": "",
      "location": "",
      "genre": "top"
    },
    ...
  ]
}
```

### 2. 获取电台音频流链接

**请求：**
```bash
GET http://localhost:8405/api/stream/{station_id}
```

**示例：**
```bash
curl http://localhost:8405/api/stream/wfan
```

**响应：**
```json
{
  "success": true,
  "stream_url": "https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8"
}
```

## Python 代码使用

### 方法 1：使用 radio_scraper.py

```python
from radio_scraper import RadioNetScraper

# 创建爬虫实例
scraper = RadioNetScraper()

# 获取热门电台列表
stations = scraper.get_top_stations()
print(f"找到 {len(stations)} 个热门电台")

# 遍历电台
for station in stations:
    print(f"电台: {station['name']}")
    print(f"ID: {station['id']}")
    print(f"URL: {station['url']}")

    # 获取音频流
    stream_url = scraper.get_stream_url(station['id'])
    if stream_url:
        print(f"流媒体: {stream_url}")
    print()
```

### 方法 2：使用 API 端点

```python
import requests

# 获取电台列表
response = requests.get('http://localhost:8405/api/top-stations')
data = response.json()

if data['success']:
    stations = data['data']
    print(f"找到 {len(stations)} 个电台")

    # 获取第一个电台的流媒体链接
    first_station_id = stations[0]['id']
    stream_response = requests.get(f'http://localhost:8405/api/stream/{first_station_id}')
    stream_data = stream_response.json()

    if stream_data['success']:
        print(f"流媒体链接: {stream_data['stream_url']}")
```

## 命令行测试

### 测试爬虫功能
```bash
python3 test_top_stations.py
```

### 测试 API
```bash
# 获取电台列表
curl http://localhost:8405/api/top-stations | python3 -m json.tool

# 获取特定电台的流媒体链接
curl http://localhost:8405/api/stream/wfan | python3 -m json.tool
curl http://localhost:8405/api/stream/msnbc | python3 -m json.tool
curl http://localhost:8405/api/stream/foxnews | python3 -m json.tool
```

## 技术实现

### 1. 多重解析策略

爬虫使用 4 种方法来确保成功抓取数据：

1. **HTML 卡片元素解析** - 查找包含 "station" 或 "card" class 的 div 元素
2. **链接元素解析** - 提取所有匹配 `/s/{station_id}` 的链接
3. **JSON-LD 结构化数据** - 从页面中的 JSON 数据提取
4. **JavaScript 代码分析** - 从 JS 中提取配置

### 2. 音频流提取

支持多种音频格式：
- HLS (.m3u8) - 高质量流媒体
- MP3 (.mp3) - 标准音频
- AAC (.aac) - 高级音频编码
- PLS (.pls) - 播放列表

### 3. 缓存机制

- 数据缓存 5 分钟，减少对源网站的请求
- 分离缓存：新闻电台和热门电台使用独立缓存

## 代码位置

- **爬虫模块**：`radio_scraper.py` - `get_top_stations()` 方法（第 37-113 行）
- **API 端点**：`app.py` - `/api/top-stations` 路由（第 46-60 行）
- **测试脚本**：`test_top_stations.py`

## 测试结果

✅ 成功抓取 98 个热门电台
✅ 成功提取电台信息（名称、ID、Logo）
✅ 成功获取音频流链接
✅ API 端点正常工作
✅ 缓存机制正常运行

## 常见问题

### Q: 如何添加其他页面的爬取？
A: 参考 `get_top_stations()` 方法，复制并修改 URL 即可。

### Q: 音频流链接有效期多久？
A: 通常为几小时到几天，建议使用时实时获取。

### Q: 如何清除缓存？
A: 调用 `scraper.clear_cache()` 或重启应用。

### Q: 支持哪些流媒体格式？
A: HLS (.m3u8)、MP3、AAC、PLS 等主流格式。

## 示例输出

```
找到 98 个热门电台:

1. WFAN 66 AM - 101.9 FM
   ID: wfan
   URL: https://www.radio.net/s/wfan
   流: https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8

2. 94 WIP Sportsradio
   ID: 94wipsportsradio
   URL: https://www.radio.net/s/94wipsportsradio
   ...
```
