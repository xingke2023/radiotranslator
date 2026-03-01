# 📺 M3U8/HLS 播放技术说明

## 🎯 M3U8 播放原理

### 什么是HLS？

**HLS (HTTP Live Streaming)** 是苹果公司开发的基于HTTP的自适应比特率流媒体传输协议。

### M3U8 文件结构

```
播放列表 (playlist.m3u8)
    ├── 清单文件 (manifest)
    │   ├── 码率1: stream_low.m3u8
    │   ├── 码率2: stream_medium.m3u8
    │   └── 码率3: stream_high.m3u8
    └── 媒体片段
        ├── segment1.ts (2-10秒)
        ├── segment2.ts
        ├── segment3.ts
        └── ...
```

### 播放流程

```
1. 客户端请求 M3U8 索引文件
         ↓
2. 解析 M3U8 获取 TS 切片列表
         ↓
3. 按序下载 TS 媒体片段
         ↓
4. 使用 MSE (Media Source Extensions) 解码
         ↓
5. 实时播放音频/视频
```

## 🔧 HLS.js 集成方案

### 为什么需要 HLS.js？

| 浏览器 | 原生HLS支持 | 需要HLS.js |
|--------|-------------|------------|
| Safari (iOS/macOS) | ✅ 支持 | ❌ 不需要 |
| Chrome | ❌ 不支持 | ✅ 需要 |
| Firefox | ❌ 不支持 | ✅ 需要 |
| Edge | ❌ 不支持 | ✅ 需要 |

### 实现代码

#### 1. 引入 HLS.js

```html
<!-- CDN方式 -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
```

#### 2. 基础播放实现

```javascript
const audio = document.getElementById('audioPlayer');
const streamUrl = 'https://example.com/playlist.m3u8';

if (Hls.isSupported()) {
    // 使用 HLS.js
    const hls = new Hls({
        debug: false,              // 调试模式
        enableWorker: true,        // 启用Web Worker
        lowLatencyMode: true,      // 低延迟模式
        backBufferLength: 90       // 缓冲时长(秒)
    });

    hls.loadSource(streamUrl);     // 加载源
    hls.attachMedia(audio);        // 绑定媒体元素

    // 监听清单解析完成
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        audio.play();
    });

    // 错误处理
    hls.on(Hls.Events.ERROR, function(event, data) {
        if (data.fatal) {
            switch(data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                    // 网络错误，尝试恢复
                    hls.startLoad();
                    break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                    // 媒体错误，尝试恢复
                    hls.recoverMediaError();
                    break;
                default:
                    // 无法恢复的错误
                    hls.destroy();
                    break;
            }
        }
    });
} else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari 原生支持
    audio.src = streamUrl;
    audio.play();
}
```

## 🎨 本项目实现

### 文件结构

```
/var/www/radionet/
├── templates/
│   └── player.html          # 播放器页面 (已集成HLS.js)
├── stations_streams_only.json  # 电台数据
└── app.py                   # Flask服务器
```

### 核心功能

#### 1. 自动格式检测

```javascript
function detectFormat(url) {
    if (url.includes('.m3u8')) return 'm3u8';  // HLS格式
    if (url.includes('.mp3')) return 'mp3';    // MP3格式
    if (url.includes('.aac')) return 'aac';    // AAC格式
    return 'stream';                            // 其他流格式
}
```

#### 2. 智能播放策略

```
M3U8流 → HLS.js支持？
            ├─ 是 → 使用HLS.js播放
            └─ 否 → Safari原生支持？
                      ├─ 是 → 使用原生播放
                      └─ 否 → 提示不支持
```

#### 3. 错误恢复机制

- **网络错误**: 自动重试加载
- **媒体错误**: 尝试恢复解码
- **致命错误**: 自动切换到下一个电台

## 📊 支持的格式

### 当前支持

| 格式 | 扩展名 | 播放方式 | 浏览器支持 |
|------|--------|----------|------------|
| HLS | .m3u8 | HLS.js / 原生 | 全平台 |
| MP3 | .mp3 | 原生audio | 全平台 |
| AAC | .aac | 原生audio | 全平台 |

### 28个电台格式分布

```bash
# 查看格式统计
cat stations_streams_only.json | grep -o '\.m3u8\|\.mp3\|\.aac' | sort | uniq -c
```

示例结果:
```
18 个 .m3u8 (HLS)
7  个 .mp3
3  个 .aac
```

## 🔍 调试技巧

### 1. 浏览器控制台

```javascript
// 查看HLS.js版本
console.log('HLS.js版本:', Hls.version);

// 监听所有HLS事件
Object.keys(Hls.Events).forEach(event => {
    hls.on(Hls.Events[event], (e, data) => {
        console.log(event, data);
    });
});
```

### 2. 测试M3U8流

```bash
# 使用curl测试
curl -I "https://example.com/playlist.m3u8"

# 使用ffprobe分析
ffprobe "https://example.com/playlist.m3u8"

# 使用VLC播放
vlc "https://example.com/playlist.m3u8"
```

### 3. Chrome DevTools

1. 打开 **Network** 标签
2. 过滤 `.m3u8` 和 `.ts` 文件
3. 查看请求时序和响应

## 🚀 性能优化

### HLS.js 配置优化

```javascript
const hls = new Hls({
    // 性能配置
    maxBufferLength: 30,        // 最大缓冲长度(秒)
    maxMaxBufferLength: 60,     // 最大缓冲长度上限
    maxBufferSize: 60 * 1000 * 1000,  // 60MB

    // 延迟优化
    lowLatencyMode: true,       // 低延迟模式
    liveSyncDuration: 3,        // 直播同步时长

    // 加载优化
    enableWorker: true,         // 启用Web Worker
    workerPath: '/hls.worker.js',

    // 错误恢复
    fragLoadingTimeOut: 20000,  // 片段加载超时
    manifestLoadingTimeOut: 10000,  // 清单加载超时
    levelLoadingTimeOut: 10000      // 级别加载超时
});
```

### 网络优化

```javascript
// 预加载策略
audio.preload = 'metadata';  // 或 'auto' / 'none'

// CORS配置
hls.config.xhrSetup = function(xhr, url) {
    xhr.withCredentials = true;
};
```

## 🌐 跨域问题

### 服务器端配置

**Nginx:**
```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
add_header Access-Control-Allow-Headers 'Range';
```

**Apache:**
```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
```

### 客户端处理

```javascript
// HLS.js自动处理CORS
// 确保服务器返回正确的CORS头即可
```

## 📱 移动端适配

### iOS Safari

```javascript
// iOS需要用户手势触发播放
document.addEventListener('touchend', function() {
    if (!isPlaying) {
        audio.play();
    }
}, { once: true });
```

### Android Chrome

```javascript
// Android需要处理自动播放策略
audio.muted = false;  // 有声音需要用户交互
audio.play().catch(e => {
    console.log('自动播放被阻止:', e);
});
```

## 🔗 参考资料

- [HLS.js官方文档](https://github.com/video-dev/hls.js)
- [HLS协议规范](https://datatracker.ietf.org/doc/html/rfc8216)
- [MDN - Media Source Extensions](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API)
- [Apple HLS指南](https://developer.apple.com/documentation/http_live_streaming)

## 💡 常见问题

### Q: 为什么有些M3U8播放不了？

A: 可能的原因：
1. CORS跨域限制
2. 流URL已过期
3. 地域限制
4. 需要特定的User-Agent或认证

### Q: HLS.js vs 原生HLS哪个更好？

A:
- **Safari**: 优先使用原生（性能更好）
- **其他浏览器**: 使用HLS.js（唯一选择）

### Q: 如何降低延迟？

A:
```javascript
const hls = new Hls({
    lowLatencyMode: true,
    liveSyncDuration: 1,
    liveMaxLatencyDuration: 5
});
```

## 🎉 总结

本项目已完美集成HLS.js，支持：

✅ 自动格式检测
✅ 智能播放策略
✅ 错误自动恢复
✅ 全浏览器兼容
✅ 格式标识显示
✅ 28个电台即点即播

享受无缝的流媒体播放体验！🎵
