# Radio.net 电台音频流抓取程序

这是一个用于抓取 [radio.net](https://www.radio.net/topic/news) 新闻类电台音频流的 Flask 应用程序。

## 功能特点

- 自动抓取 radio.net 新闻类电台列表
- 提取电台的音频流 URL
- 提供友好的 Web 界面
- 支持电台搜索功能
- 在线播放电台
- 复制音频流链接
- 数据缓存机制(5分钟)

## 项目结构

```
radionet/
├── app.py              # Flask 应用主程序
├── radio_scraper.py    # radio.net 爬虫模块
├── requirements.txt    # Python 依赖包
├── templates/          # HTML 模板
│   └── index.html     # 主页面
└── README.md          # 项目文档
```

## 安装依赖

```bash
pip install -r requirements.txt
```

### 依赖包说明

- **Flask**: Web 框架
- **requests**: HTTP 请求库
- **beautifulsoup4**: HTML 解析库
- **lxml**: XML/HTML 解析器

## 使用方法

### 1. 启动服务

```bash
python app.py
```

服务将在 `http://localhost:5000` 启动

### 2. 访问 Web 界面

在浏览器中打开: `http://localhost:5000`

### 3. 功能操作

- **浏览电台**: 页面会自动加载新闻类电台列表
- **搜索电台**: 在搜索框中输入关键词,点击搜索按钮
- **播放电台**: 点击电台卡片上的"播放"按钮
- **获取流URL**: 点击"获取流"按钮查看音频流地址
- **刷新数据**: 点击"刷新"按钮重新抓取电台数据

## API 接口

### 1. 获取电台列表

```
GET /api/stations
```

返回示例:
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "id": "bbc-world-service",
      "name": "BBC World Service",
      "url": "https://www.radio.net/s/bbc-world-service",
      "logo": "https://...",
      "description": "...",
      "location": "UK",
      "genre": "news"
    }
  ]
}
```

### 2. 获取音频流 URL

```
GET /api/stream/<station_id>
```

返回示例:
```json
{
  "success": true,
  "stream_url": "https://stream.example.com/radio.mp3"
}
```

### 3. 搜索电台

```
GET /api/search?q=<关键词>
```

### 4. 刷新数据

```
GET /api/refresh
```

## 爬虫说明

`radio_scraper.py` 模块实现了以下功能:

### 主要类和方法

**RadioNetScraper 类:**

- `get_news_stations()`: 获取新闻类电台列表
- `get_stream_url(station_id)`: 获取指定电台的音频流 URL
- `search_stations(query)`: 搜索电台
- `clear_cache()`: 清除缓存

### 抓取策略

程序采用多种方法尝试提取电台信息:

1. 解析 HTML 页面中的电台卡片元素
2. 从 JavaScript 代码中提取数据
3. 解析 JSON-LD 结构化数据
4. 查找电台链接并解析相关信息

### 音频流提取

支持多种方式获取音频流 URL:

1. 从页面 JavaScript 中提取流 URL
2. 解析 JSON 配置数据
3. 尝试 API 端点

## 独立测试爬虫

```bash
python radio_scraper.py
```

这将测试爬虫功能并显示前 10 个电台的信息。

## 注意事项

1. **网络访问**: 需要能够访问 radio.net 网站
2. **反爬虫机制**: radio.net 可能有反爬虫措施,如遇到问题可能需要:
   - 增加请求延迟
   - 使用代理 IP
   - 更新 User-Agent
3. **音频流**: 某些电台的音频流可能需要特殊的认证或有地域限制
4. **数据缓存**: 电台数据会缓存 5 分钟,可通过刷新功能更新

## 故障排除

### 问题: 无法抓取到电台

**可能原因:**
- 网络连接问题
- radio.net 网站结构变化
- 被反爬虫机制拦截

**解决方案:**
- 检查网络连接
- 查看控制台错误信息
- 更新爬虫代码以适应网站变化

### 问题: 无法播放音频流

**可能原因:**
- 音频流 URL 提取失败
- 流地址有地域限制
- 需要特殊认证

**解决方案:**
- 检查浏览器控制台的网络请求
- 尝试在 VLC 等播放器中测试流 URL
- 查看 radio.net 网站的实际播放方式

## 开发建议

如需扩展功能:

1. **添加更多电台类型**: 修改 `radio_scraper.py` 支持其他分类
2. **数据库存储**: 使用 SQLite 或 PostgreSQL 持久化电台数据
3. **用户收藏**: 添加用户系统和收藏功能
4. **定时更新**: 使用 Celery 定时更新电台数据
5. **音频代理**: 实现服务端音频流代理,避免跨域问题

## 许可证

本项目仅供学习和研究使用,请遵守 radio.net 的服务条款。

## 免责声明

本程序仅用于技术学习和研究,不得用于商业用途。使用本程序时请遵守相关法律法规和网站服务条款。
