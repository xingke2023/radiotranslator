import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

const API_BASE_URL = 'https://radio.xingke888.com/sse8'
const CENTRIFUGO_SSE_URL = 'https://radio.xingke888.com/centrifugo/connection/uni_sse'

function SubtitleRadio() {
  const { t } = useTranslation()

  // State
  const [stations, setStations] = useState([])
  const [selectedStation, setSelectedStation] = useState('')
  const [currentStation, setCurrentStation] = useState(null)
  const [status, setStatus] = useState({ message: '未连接', type: 'info' })
  const [isConnected, setIsConnected] = useState(false)
  const [subtitleQueue, setSubtitleQueue] = useState([])
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1)
  const [currentSubtitle, setCurrentSubtitle] = useState({ en: '等待字幕...', zh: '' })
  const [audioTime, setAudioTime] = useState(0)
  const [offsetValue, setOffsetValue] = useState(0)

  // Refs
  const audioRef = useRef(null)
  const eventSourceRef = useRef(null)
  const clientIdRef = useRef(null)
  const heartbeatIntervalRef = useRef(null)
  const updateIntervalRef = useRef(null)

  // 加载电台列表
  useEffect(() => {
    loadStations()

    return () => {
      disconnect()
    }
  }, [])

  // 定时更新字幕
  useEffect(() => {
    updateIntervalRef.current = setInterval(updateSubtitle, 100)
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [subtitleQueue, offsetValue])

  const loadStations = async () => {
    try {
      updateStatus('正在加载电台列表...', 'info')
      const response = await fetch(`${API_BASE_URL}/api/radios`)
      const data = await response.json()

      if (data.success) {
        setStations(data.radios)
        updateStatus('电台列表加载完成', 'info')
      } else {
        updateStatus('加载电台列表失败', 'error')
      }
    } catch (error) {
      console.error('加载电台列表失败:', error)
      updateStatus('加载电台列表失败', 'error')
    }
  }

  const updateStatus = (message, type = 'info') => {
    setStatus({ message, type })
    console.log(`[${type.toUpperCase()}] ${message}`)
  }

  const updateSubtitle = () => {
    if (subtitleQueue.length === 0 || !audioRef.current) return

    const currentTimeMs = audioRef.current.currentTime * 1000
    const adjustedTimeMs = currentTimeMs - offsetValue

    let foundIndex = -1
    for (let i = 0; i < subtitleQueue.length; i++) {
      const subtitle = subtitleQueue[i]
      const startTime = subtitle.offset
      const endTime = subtitle.offset + subtitle.duration

      if (adjustedTimeMs >= startTime && adjustedTimeMs < endTime) {
        foundIndex = i
        break
      }
    }

    if (foundIndex !== -1 && foundIndex !== currentSubtitleIndex) {
      setCurrentSubtitleIndex(foundIndex)
      const subtitle = subtitleQueue[foundIndex]
      setCurrentSubtitle({
        en: subtitle.text,
        zh: subtitle.translation,
        number: foundIndex + 1
      })
      console.log(`📺 显示字幕 [${foundIndex}]: ${subtitle.text}`)
    }

    setAudioTime(audioRef.current.currentTime)
  }

  const connect = async () => {
    if (!selectedStation) {
      updateStatus('请先选择电台', 'error')
      return
    }

    const station = stations.find(s => s.id === selectedStation)
    if (!station) {
      updateStatus('电台信息不存在', 'error')
      return
    }

    console.log('🎙️ 准备连接电台:', station)
    updateStatus(`正在连接 ${station.name}...`, 'info')
    setCurrentStation(station)
    setSubtitleQueue([])
    setCurrentSubtitleIndex(-1)

    try {
      // 步骤1: 获取 token
      const connectUrl = `${API_BASE_URL}/sse/connect?station_code=${station.id}`
      const response = await fetch(connectUrl)

      if (!response.ok) {
        updateStatus('获取连接信息失败', 'error')
        return
      }

      const data = await response.json()
      console.log('✅ 获取到连接信息:', data)

      // 步骤2: 建立 SSE 连接
      updateStatus('正在建立 SSE 连接...', 'info')

      const sseUrl = new URL(CENTRIFUGO_SSE_URL)
      sseUrl.searchParams.append('cf_connect', JSON.stringify({
        token: data.token
      }))

      eventSourceRef.current = new EventSource(sseUrl)

      eventSourceRef.current.onopen = () => {
        updateStatus('SSE 连接已建立', 'connected')
      }

      eventSourceRef.current.onmessage = (event) => {
        if (event.data === '{}') return

        try {
          const msg = JSON.parse(event.data)

          // 连接成功
          if (msg.connect) {
            clientIdRef.current = msg.connect.client
            console.log('✅ Centrifugo 连接成功, Client ID:', clientIdRef.current)
            updateStatus(`已连接到 ${station.name}`, 'connected')
            setIsConnected(true)

            // 步骤3: 订阅电台
            startStation(station).then(() => {
              startHeartbeat(station)
            }).catch(err => {
              console.error('订阅失败:', err)
            })
          }

          // 收到字幕数据
          if (msg.pub && msg.pub.data) {
            const pushData = msg.pub.data

            if (pushData.event === 'recognized') {
              console.log('📥 收到字幕:', pushData)

              const translation = pushData.translations && pushData.translations['zh-CN']
                ? pushData.translations['zh-CN']
                : ''

              const subtitle = {
                text: pushData.text,
                translation: translation,
                offset: pushData.offset,
                duration: pushData.duration,
                timestamp: pushData.timestamp
              }

              setSubtitleQueue(prev => [...prev, subtitle])
              console.log(`✅ 字幕已加入队列: ${translation.substring(0, 30)}...`)
            }
            else if (pushData.event === 'started') {
              console.log('🚀 语音识别已启动')
              updateStatus(`${station.name} 识别已启动，等待字幕...`, 'connected')
            }
            else if (pushData.event === 'reconnecting') {
              const retryMsg = pushData.isAudioSourceError
                ? `音频源连接失败，正在重试 (${pushData.retryCount}/${pushData.maxRetries})...`
                : `连接中断，正在重试 (${pushData.retryCount}/${pushData.maxRetries})...`
              console.log(retryMsg)
              updateStatus(retryMsg, 'info')
            }
            else if (pushData.event === 'audioSourceFailed') {
              console.error('❌ 音频源连接失败:', pushData)
              updateStatus(`❌ ${pushData.message}`, 'error')
              setTimeout(() => disconnect(), 3000)
            }
          }
        } catch (error) {
          console.error('❌ 解析消息失败:', error)
        }
      }

      eventSourceRef.current.onerror = (error) => {
        console.error('❌ SSE 错误:', error)
        updateStatus('SSE 连接错误', 'error')

        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          disconnect()
        }
      }

      // 加载音频流
      if (audioRef.current) {
        const audio = audioRef.current

        // 添加错误处理
        audio.addEventListener('error', (e) => {
          console.error('音频加载错误:', e)
          updateStatus('音频加载失败，请检查电台URL', 'error')
        })

        // 添加加载成功监听
        audio.addEventListener('canplay', () => {
          console.log('✅ 音频已准备好播放')
        })

        // 设置音频源
        audio.src = station.url
        audio.load()

        // 尝试播放
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ 音频开始播放')
            })
            .catch(err => {
              console.error('音频自动播放失败:', err)
              updateStatus('请手动点击播放按钮开始播放', 'info')
            })
        }
      }

    } catch (error) {
      console.error('❌ 连接失败:', error)
      updateStatus(`连接失败: ${error.message}`, 'error')
    }
  }

  const startStation = async (station) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sse/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          station_code: station.id,
          client_id: clientIdRef.current
        })
      })

      const result = await response.json()
      console.log('✅ 电台启动:', result.message)
      updateStatus(`${station.name} 已启动，等待字幕...`, 'connected')
    } catch (error) {
      console.error('❌ 启动电台失败:', error)
      updateStatus('启动电台失败', 'error')
    }
  }

  const startHeartbeat = (station) => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }

    sendHeartbeat(station)

    heartbeatIntervalRef.current = setInterval(() => {
      sendHeartbeat(station)
    }, 30000)

    console.log('💓 心跳已启动（每 30 秒）')
  }

  const sendHeartbeat = async (station) => {
    if (!clientIdRef.current || !station) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/client/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientIdRef.current,
          channel: `station:${station.id}`
        })
      })

      const result = await response.json()
      if (result.success) {
        console.log('💓 心跳发送成功')
      }
    } catch (error) {
      console.error('❌ 心跳发送失败:', error)
    }
  }

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
      console.log('💔 心跳已停止')
    }
  }

  const disconnect = async () => {
    // 通知服务器断开
    if (clientIdRef.current && currentStation) {
      try {
        await fetch(`${API_BASE_URL}/api/client/disconnect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientIdRef.current,
            channel: `station:${currentStation.id}`
          })
        })
        console.log('✅ 已通知服务器断开连接')
      } catch (error) {
        console.error('⚠️ 通知服务器断开失败:', error)
      }
    }

    stopHeartbeat()

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeAttribute('src')
      audioRef.current.load()
    }

    setSubtitleQueue([])
    setCurrentSubtitleIndex(-1)
    setCurrentSubtitle({ en: '已断开连接', zh: '' })
    clientIdRef.current = null
    setCurrentStation(null)
    setIsConnected(false)

    updateStatus('已断开连接', 'info')
  }

  const statusColors = {
    info: 'bg-gray-700',
    connected: 'bg-green-900',
    error: 'bg-red-900'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <Helmet>
        <title>字幕电台 - RadioTranslator</title>
        <meta name="description" content="实时字幕同步播放电台" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-primary">
          🎙️ 实时字幕同步播放
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Server-Sent Events (SSE) 实时字幕推送
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：播放器和控制 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-primary mb-4">音频流播放</h2>

              {/* 状态 */}
              <div className={`${statusColors[status.type]} p-3 rounded-lg mb-4`}>
                状态: {status.message}
              </div>

              {/* 电台选择 */}
              <div className="mb-4">
                <label className="block text-primary font-bold mb-2">选择电台:</label>
                <select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  disabled={isConnected}
                  className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">请选择电台</option>
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name} {station.subtitle && `(${station.subtitle})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* 控制按钮 */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={connect}
                  disabled={isConnected || !selectedStation}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  连接并播放
                </button>
                <button
                  onClick={disconnect}
                  disabled={!isConnected}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  断开连接
                </button>
              </div>

              {/* 字幕偏移调整 */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  字幕延迟调整 (ms):
                </label>
                <input
                  type="number"
                  value={offsetValue}
                  onChange={(e) => {
                    setOffsetValue(parseInt(e.target.value) || 0)
                    setCurrentSubtitleIndex(-1)
                  }}
                  step="100"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  (正值=字幕延迟, 负值=字幕提前)
                </p>
              </div>

              {/* 音频播放器 */}
              <audio
                ref={audioRef}
                controls
                crossOrigin="anonymous"
                preload="none"
                className="w-full mb-4"
              />

              {/* 时间信息 */}
              <div className="text-sm text-gray-400 space-y-1">
                <div>音频播放时间: <span className="text-white">{audioTime.toFixed(2)}s</span></div>
                <div>当前字幕偏移: <span className="text-white">{offsetValue}ms</span></div>
                <div>字幕队列: <span className="text-white">{subtitleQueue.length} 条</span></div>
              </div>
            </div>
          </div>

          {/* 右侧：字幕显示和队列 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 当前字幕 */}
            <div className="bg-black bg-opacity-80 rounded-lg p-8 min-h-[300px] flex flex-col justify-center items-center text-center">
              <div className="subtitle-en text-3xl font-bold text-white mb-6 leading-relaxed">
                {currentSubtitle.number && (
                  <span className="inline-block bg-primary text-gray-900 px-4 py-1 rounded-full text-xl mr-3">
                    #{currentSubtitle.number}
                  </span>
                )}
                {currentSubtitle.en}
              </div>
              <div className="subtitle-zh text-2xl text-primary leading-relaxed">
                {currentSubtitle.zh}
              </div>
            </div>

            {/* 字幕队列 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-primary mb-4">
                字幕队列 (最近40条)
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {subtitleQueue.slice(-40).map((item, idx) => {
                  const globalIndex = subtitleQueue.length - 40 + idx
                  const isActive = globalIndex === currentSubtitleIndex
                  return (
                    <div
                      key={idx}
                      className={`${
                        isActive ? 'bg-green-900 border-green-500' : 'bg-gray-700 border-primary'
                      } border-l-4 p-3 rounded-r-lg flex gap-3`}
                    >
                      <div className={`${
                        isActive ? 'text-green-400' : 'text-primary'
                      } font-bold text-sm min-w-[60px] flex-shrink-0`}>
                        #{globalIndex + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mb-1">
                          Offset: {item.offset.toFixed(2)}ms | Duration: {item.duration.toFixed(2)}ms
                        </div>
                        <div className="text-sm text-white mb-1">{item.text}</div>
                        <div className="text-sm text-primary">{item.translation}</div>
                      </div>
                    </div>
                  )
                })}
                {subtitleQueue.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    暂无字幕数据
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubtitleRadio
