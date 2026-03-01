# 🎉 Top Stations 流媒体抓取结果

## 📊 执行结果

运行脚本：`python3 get_all_top_streams.py`

### ✅ 成功统计
- **总计电台**：98 个
- **成功获取流媒体**：67 个
- **成功率**：68.4%
- **失败数量**：31 个（部分电台页面结构不同或流媒体链接被加密）

### 📁 生成的文件

| 文件名 | 大小 | 说明 |
|--------|------|------|
| `top_stations_with_streams.json` | 26 KB | JSON 格式，包含所有电台的完整信息和流媒体链接 |
| `top_stations.m3u` | 18 KB | M3U 播放列表格式，可直接用于播放器 |

## 🎵 流媒体格式分布

| 格式 | 数量 | 占比 |
|------|------|------|
| HLS (.m3u8) | 33 个 | 49.3% |
| MP3 | 22 个 | 32.8% |
| AAC | 12 个 | 17.9% |

## 📡 成功获取的电台示例

### 前 10 个电台

1. **WFAN 66 AM - 101.9 FM**
   - ID: `wfan`
   - 流: `https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8`

2. **94 WIP Sportsradio**
   - ID: `94wipsportsradio`
   - 流: `https://live.amperwave.net/manifest/audacy-wipfmaac-hlsc.m3u8`

3. **WXYT-FM - 97.1 The Ticket**
   - ID: `wxyt`
   - 流: `https://live.amperwave.net/manifest/audacy-wxytfmaac-hlsc.m3u8`

4. **MSNBC**
   - ID: `msnbc`
   - 流: `https://tunein.cdnstream1.com/3511_96.aac/playlist.m3u8`

5. **WSCR - 670 AM The Score**
   - ID: `wscr`
   - 流: `https://live.amperwave.net/manifest/audacy-wscramaac-hlsc.m3u8/`

6. **WINS - 1010 WINS CBS New York**
   - ID: `wins`
   - 流: `https://live.amperwave.net/manifest/audacy-winsamaac-hlsc.m3u8`

7. **WMVP - ESPN 1000 AM**
   - ID: `wmvp`
   - 流: `https://live.amperwave.net/manifest/goodkarma-wmvpamaac-hlsc1.m3u8`

8. **KIRO - 710 ESPN Seattle 710 AM**
   - ID: `kiro`
   - 流: `https://bonneville.cdnstream1.com/2642_48.aac`

9. **WEEI 93.7 FM - Boston Sports News**
   - ID: `weeifm`
   - 流: `https://live.amperwave.net/manifest/audacy-weeifmaac-hlsc.m3u8`

10. **Steelers Nation Radio**
    - ID: `snr`
    - 流: `https://cdn3.wowza.com/1/T0RzenNieVdQZlhj/OTd3RUJW/hls/live/playlist.m3u8`

## 🎯 如何使用这些文件

### 1. 使用 JSON 文件（编程方式）

```python
import json

# 读取文件
with open('top_stations_with_streams.json', 'r', encoding='utf-8') as f:
    stations = json.load(f)

# 播放第一个电台
first_station = stations[0]
print(f"播放: {first_station['name']}")
print(f"流URL: {first_station['stream_url']}")

# 使用 ffplay 播放（需要安装 ffmpeg）
import subprocess
subprocess.run(['ffplay', first_station['stream_url']])
```

### 2. 使用 M3U 播放列表

**在 VLC 播放器中：**
1. 打开 VLC
2. 媒体 → 打开文件
3. 选择 `top_stations.m3u`
4. 播放

**在命令行中：**
```bash
# 使用 VLC
vlc top_stations.m3u

# 使用 MPV
mpv top_stations.m3u

# 使用 ffplay 播放单个流
ffplay "https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8"
```

### 3. 通过 Web API 访问

```bash
# 获取所有 top stations
curl http://localhost:8405/api/top-stations

# 获取特定电台的流媒体
curl http://localhost:8405/api/stream/wfan
curl http://localhost:8405/api/stream/msnbc
```

### 4. 在网页播放器中使用

```html
<!DOCTYPE html>
<html>
<body>
  <audio id="player" controls></audio>
  <script>
    fetch('top_stations_with_streams.json')
      .then(r => r.json())
      .then(stations => {
        document.getElementById('player').src = stations[0].stream_url;
      });
  </script>
</body>
</html>
```

## 🔍 JSON 文件结构

```json
[
  {
    "id": "wfan",
    "name": "WFAN 66 AM - 101.9 FM",
    "url": "https://www.radio.net/s/wfan",
    "logo": "https://www.radio.net/100/wfan.jpeg?version=...",
    "description": "",
    "location": "",
    "genre": "top",
    "stream_url": "https://live.amperwave.net/manifest/audacy-wfanamaac-hlsc.m3u8"
  },
  ...
]
```

## 🌐 流媒体服务商分布

根据抓取的流媒体链接，主要服务商包括：

- **Amperwave** (live.amperwave.net) - 音频CDN
- **StreamTheWorld** (playerservices.streamtheworld.com) - 全球流媒体
- **TuneIn** (tunein.cdnstream1.com) - 电台聚合平台
- **Bonneville** (bonneville.cdnstream1.com) - 电台网络
- **Revma/iHeartMedia** (stream.revma.ihrhls.com) - 大型广播集团

## 📈 知名电台

成功获取的知名电台包括：

### 新闻类
- MSNBC - 美国新闻频道
- CNN - 有线新闻网
- WINS - CBS 纽约新闻
- WBAL - 巴尔的摩新闻

### 体育类
- ESPN 系列（多个频率）
- TSN 690 Montreal
- FOX Sports
- Steelers Nation Radio
- Raider Nation Radio

### 国际电台
- France Info - 法国新闻
- Russkoe Radio - 俄罗斯电台
- La Rancherita del Aire - 墨西哥电台

## ⚠️ 注意事项

1. **流媒体链接有效期**：链接可能会过期或变更，建议使用时实时从 API 获取
2. **地理限制**：某些电台可能有地区限制
3. **版权声明**：仅供个人学习研究使用，请遵守相关法律法规
4. **更新频率**：建议定期重新抓取以获取最新链接

## 🚀 重新抓取

如需重新抓取或更新数据：

```bash
# 重新抓取所有 top stations
python3 get_all_top_streams.py

# 只测试前 10 个
python3 demo_top_streams.py

# 通过 API 强制刷新缓存
curl http://localhost:8405/api/refresh
```

## 📞 技术支持

如遇到问题：
1. 检查网络连接
2. 确认 Radio.net 网站可访问
3. 查看 Flask 应用日志
4. 验证流媒体 URL 是否有效

---

**生成时间**：2025-10-26
**数据来源**：https://www.radio.net/top-stations
**工具版本**：radio_scraper.py v1.0
