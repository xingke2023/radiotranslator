# 📡 Radio.net 电台 API 文档

## 🎯 API 端点总览

| 端点 | 方法 | 说明 | 返回数据 |
|------|------|------|----------|
| `/api/stations` | GET | 获取新闻类电台列表（基本信息） | 电台列表（无流媒体链接） |
| `/api/stations/streams` | GET | 获取新闻类电台列表（含流媒体） | 完整电台列表 + 流媒体链接 |
| `/api/top-stations` | GET | 获取热门电台列表（基本信息） | 电台列表（无流媒体链接） |
| **`/api/top-stations/streams`** | **GET** | **获取热门电台列表（含流媒体）** | **完整电台列表 + 流媒体链接** |
| `/api/stream/<station_id>` | GET | 获取指定电台的流媒体链接 | 单个电台的流媒体URL |
| `/api/search?q=<query>` | GET | 搜索电台 | 匹配的电台列表 |
| `/api/refresh` | GET | 刷新缓存 | 成功消息 |
| `/stations.m3u` | GET | 下载播放列表 | M3U 文件 |

## 🔥 推荐使用：获取 67 个热门电台的完整资料

### **端点：`/api/top-stations/streams`**

这是您想要的接口！**一次性获取所有 67 个热门电台的完整信息和流媒体链接。**

#### 📋 请求示例

```bash
# 获取所有 67 个热门电台
curl http://localhost:8405/api/top-stations/streams

# 格式化 JSON 输出
curl http://localhost:8405/api/top-stations/streams | python3 -m json.tool

# 保存到文件
curl http://localhost:8405/api/top-stations/streams > my_stations.json
```

#### 📦 响应格式

```json
{
  "success": true,
  "count": 67,
  "stations": [
    {
      "id": "wfan",
      "name": "Listen to the station WFAN 66 AM - 101.9 FM online now",
      "url": "https://www.radio.net/s/wfan",
      "logo": "https://www.radio.net/100/wfan.jpeg?version=...",
      "description": "",
      "location": "",
      "genre": "top",
      "stream_url": "https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8"
    },
    ...
  ]
}
```

#### 🔑 返回字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `success` | Boolean | 请求是否成功 | `true` |
| `count` | Integer | 电台数量 | `67` |
| `stations` | Array | 电台列表 | - |
| `stations[].id` | String | 电台唯一ID | `"wfan"` |
| `stations[].name` | String | 电台名称 | `"WFAN 66 AM - 101.9 FM"` |
| `stations[].url` | String | 电台详情页URL | `"https://www.radio.net/s/wfan"` |
| `stations[].logo` | String | 电台 Logo 图片URL | `"https://www.radio.net/100/wfan.jpeg"` |
| `stations[].description` | String | 电台描述 | `""` |
| `stations[].location` | String | 电台位置 | `""` |
| `stations[].genre` | String | 电台类型 | `"top"` |
| **`stations[].stream_url`** | **String** | **流媒体链接** | **`"https://...m3u8"`** |

---

## 📖 其他 API 端点详细说明

### 1. 获取新闻类电台列表（基本信息）

```bash
GET /api/stations
```

**响应：**
```json
{
  "success": true,
  "count": 20,
  "data": [...]
}
```

**注意：** 不包含 `stream_url` 字段

---

### 2. 获取新闻类电台列表（含流媒体）

```bash
GET /api/stations/streams
```

**说明：** 从 `stations_streams_only.json` 读取预抓取的数据

---

### 3. 获取热门电台列表（基本信息）

```bash
GET /api/top-stations
```

**响应：**
```json
{
  "success": true,
  "count": 98,
  "data": [...]
}
```

**注意：** 不包含 `stream_url` 字段

---

### 4. 获取单个电台的流媒体链接

```bash
GET /api/stream/<station_id>
```

**请求示例：**
```bash
curl http://localhost:8405/api/stream/wfan
curl http://localhost:8405/api/stream/msnbc
```

**响应：**
```json
{
  "success": true,
  "stream_url": "https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8"
}
```

---

### 5. 搜索电台

```bash
GET /api/search?q=<关键词>
```

**请求示例：**
```bash
curl "http://localhost:8405/api/search?q=espn"
curl "http://localhost:8405/api/search?q=news"
```

**响应：**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

---

### 6. 刷新缓存

```bash
GET /api/refresh
```

**响应：**
```json
{
  "success": true,
  "message": "Data refreshed successfully",
  "count": 98
}
```

---

### 7. 下载 M3U 播放列表

```bash
GET /stations.m3u
```

**说明：** 下载新闻类电台的 M3U 播放列表文件

---

## 💻 编程示例

### Python 示例

```python
import requests
import json

# 获取所有 67 个热门电台（含流媒体链接）
response = requests.get('http://localhost:8405/api/top-stations/streams')
data = response.json()

if data['success']:
    print(f"获取到 {data['count']} 个电台\n")

    for station in data['stations']:
        print(f"电台: {station['name']}")
        print(f"ID: {station['id']}")
        print(f"流媒体: {station['stream_url']}")
        print(f"Logo: {station['logo']}")
        print()
```

### JavaScript 示例

```javascript
// 获取电台列表
fetch('http://localhost:8405/api/top-stations/streams')
  .then(response => response.json())
  .then(data => {
    console.log(`获取到 ${data.count} 个电台`);

    data.stations.forEach(station => {
      console.log(`${station.name}: ${station.stream_url}`);
    });
  });
```

### cURL 示例

```bash
# 获取所有电台并提取电台名称
curl -s http://localhost:8405/api/top-stations/streams | \
  python3 -c "import sys, json; data=json.load(sys.stdin); \
  [print(f\"{s['name']}: {s['stream_url']}\") for s in data['stations']]"

# 获取前 10 个电台
curl -s http://localhost:8405/api/top-stations/streams | \
  python3 -c "import sys, json; data=json.load(sys.stdin); \
  [print(f\"{i}. {s['name']}\") for i, s in enumerate(data['stations'][:10], 1)]"

# 统计流媒体格式
curl -s http://localhost:8405/api/top-stations/streams | \
  python3 -c "import sys, json; data=json.load(sys.stdin); \
  print('HLS:', sum(1 for s in data['stations'] if '.m3u8' in s['stream_url'])); \
  print('MP3:', sum(1 for s in data['stations'] if '.mp3' in s['stream_url'])); \
  print('AAC:', sum(1 for s in data['stations'] if '.aac' in s['stream_url']))"
```

---

## 🎵 使用流媒体链接

### 在命令行播放

```bash
# 使用 ffplay
ffplay "https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8"

# 使用 VLC
vlc "https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8"

# 使用 mpv
mpv "https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8"
```

### 在网页中播放

```html
<!DOCTYPE html>
<html>
<head>
  <title>Radio Player</title>
</head>
<body>
  <h1>Radio Player</h1>
  <select id="stationSelect"></select>
  <audio id="player" controls></audio>

  <script>
    // 加载电台列表
    fetch('http://localhost:8405/api/top-stations/streams')
      .then(r => r.json())
      .then(data => {
        const select = document.getElementById('stationSelect');
        const player = document.getElementById('player');

        data.stations.forEach(station => {
          const option = document.createElement('option');
          option.value = station.stream_url;
          option.textContent = station.name;
          select.appendChild(option);
        });

        select.onchange = () => {
          player.src = select.value;
          player.play();
        };
      });
  </script>
</body>
</html>
```

---

## 📊 数据统计

### 当前可用数据

| 类型 | 数量 | 文件 | API 端点 |
|------|------|------|----------|
| 热门电台（含流媒体） | 67 | `top_stations_with_streams.json` | `/api/top-stations/streams` |
| 新闻电台（含流媒体） | 变动 | `stations_streams_only.json` | `/api/stations/streams` |

### 流媒体格式分布（热门电台）

- HLS (.m3u8): 33 个 (49.3%)
- MP3: 22 个 (32.8%)
- AAC: 12 个 (17.9%)

---

## ⚠️ 注意事项

1. **缓存机制**：实时抓取的数据（`/api/stations`、`/api/top-stations`）会缓存 5 分钟
2. **预抓取数据**：流媒体链接（`/api/top-stations/streams`）从静态 JSON 文件读取，需要运行脚本更新
3. **流媒体有效期**：流媒体链接可能会过期，建议定期重新抓取
4. **跨域访问**：如需从其他域名访问，需配置 CORS
5. **端口号**：默认端口 8405，可通过环境变量 `FLASK_PORT` 修改

---

## 🔄 更新数据

### 重新抓取热门电台流媒体

```bash
python3 get_all_top_streams.py
```

执行完成后，API `/api/top-stations/streams` 会自动返回最新数据。

### 刷新实时缓存

```bash
curl http://localhost:8405/api/refresh
```

---

## 🚀 快速开始

### 1. 获取所有电台资料

```bash
curl http://localhost:8405/api/top-stations/streams > stations.json
```

### 2. 播放第一个电台

```bash
# 提取第一个电台的流媒体链接
STREAM_URL=$(curl -s http://localhost:8405/api/top-stations/streams | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['stations'][0]['stream_url'])")

# 播放
ffplay "$STREAM_URL"
```

### 3. 生成自定义播放列表

```python
import requests
import json

response = requests.get('http://localhost:8405/api/top-stations/streams')
data = response.json()

with open('my_playlist.m3u', 'w', encoding='utf-8') as f:
    f.write('#EXTM3U\n')
    for station in data['stations']:
        f.write(f'#EXTINF:-1,{station["name"]}\n')
        f.write(f'{station["stream_url"]}\n')

print('播放列表已生成: my_playlist.m3u')
```

---

## 📞 技术支持

- **文档位置**：`/var/www/radionet/API_DOCUMENTATION.md`
- **源代码**：`app.py`、`radio_scraper.py`
- **日志**：`/tmp/radionet_new.log`

**生成时间**：2025-10-26
**版本**：1.0
