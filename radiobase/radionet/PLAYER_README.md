# 🎵 Radio.net 在线播放器使用说明

## 🚀 快速开始

服务已经启动在端口 **8405**

## 📺 访问地址

### 主页 - 在线播放器
```
http://YOUR_SERVER_IP:8405/
```
**功能:**
- 📻 直接播放已抓取的28个电台
- 🎵 点击电台卡片即可播放
- ⏯️ 播放/暂停控制
- ⏮️⏭️ 上一个/下一个电台
- 🔊 音量控制
- ⌨️ 键盘快捷键支持
  - 空格键: 播放/暂停
  - 左箭头: 上一个电台
  - 右箭头: 下一个电台

### 爬虫页面 - 抓取新电台
```
http://YOUR_SERVER_IP:8405/scraper
```
**功能:**
- 🕷️ 实时抓取radio.net电台
- 🔍 搜索电台
- 🔄 刷新数据

## 🎯 可用的电台 (28个)

已成功抓取的知名电台包括:

1. **MSNBC** - 美国新闻
2. **CNN** - 美国新闻
3. **BBC World Service** - 英国国际广播
4. **BBC Radio 4** - 英国广播
5. **NPR 24** - 美国公共广播
6. **ESPN Radio** - 体育新闻
7. **ESPN New York 880 AM** - 纽约体育
8. **France Info** - 法国新闻
9. **FOX News 92.5 FM** - 福克斯新闻
10. **WBBM Newsradio 780 AM** - 芝加哥新闻
... 还有18个其他电台

## 📡 API接口

### 1. 获取可播放的电台列表
```
GET /api/stations/streams
```
返回所有已抓取音频流的电台

### 2. 下载M3U播放列表
```
GET /stations.m3u
```
下载M3U格式播放列表，可在VLC等播放器中使用

### 3. 实时抓取电台 (原有功能)
```
GET /api/stations - 获取电台列表
GET /api/stream/<station_id> - 获取指定电台音频流
GET /api/search?q=<关键词> - 搜索电台
GET /api/refresh - 刷新数据
```

## 🔧 更新电台数据

如需重新抓取电台音频流:

```bash
cd /var/www/radionet
python3 fetch_all_streams.py
```

这将更新 `stations_streams_only.json` 文件，刷新网页即可看到新数据。

## 📁 数据文件

- `stations_streams_only.json` - 可播放的电台数据 (28个)
- `stations_with_streams.json` - 完整数据 (包含失败的50个)
- `stations.m3u` - M3U播放列表

## 🎨 播放器特点

### 界面设计
- 💜 渐变色背景
- 🎴 卡片式电台展示
- 🎵 播放动画效果
- 📱 响应式设计，支持手机访问

### 播放功能
- ✅ HLS (m3u8) 格式支持
- ✅ MP3 格式支持
- ✅ AAC 格式支持
- ✅ 自动切换下一个电台（错误时）
- ✅ 音量记忆

## 🌐 外部访问

确保防火墙开放了 8405 端口:

```bash
# UFW
sudo ufw allow 8405

# iptables
sudo iptables -A INPUT -p tcp --dport 8405 -j ACCEPT
```

## 📝 注意事项

1. 某些电台可能有地域限制
2. 音频流URL可能会过期，需要定期重新抓取
3. 首次加载可能需要几秒钟
4. 使用Chrome/Firefox等现代浏览器以获得最佳体验

## 🆘 故障排除

### 问题: 无法播放某个电台
**原因:**
- 音频流URL可能已过期
- 浏览器不支持该音频格式
- 网络连接问题

**解决:**
- 尝试播放其他电台
- 重新运行 `fetch_all_streams.py` 更新数据
- 使用Chrome或Firefox浏览器

### 问题: 页面显示"音频流数据文件不存在"
**原因:**
- 尚未运行批量抓取脚本

**解决:**
```bash
cd /var/www/radionet
python3 fetch_all_streams.py
```

## 🎉 享受音乐!

现在打开浏览器，访问 http://YOUR_SERVER_IP:8405，开始享受全球新闻电台直播吧！
