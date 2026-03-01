import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''
const SSE_API_BASE_URL = 'https://radio.xingke888.com/sse8'
const CENTRIFUGO_SSE_URL = 'https://radio.xingke888.com/centrifugo/connection/uni_sse'
const FREE_SUBTITLE_DURATION = 120000 // 2 minutes in milliseconds

function RadioStations() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [stations, setStations] = useState([])
  const [filteredStations, setFilteredStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentStation, setCurrentStation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Subtitle states
  const [isConnected, setIsConnected] = useState(false)
  const [subtitleQueue, setSubtitleQueue] = useState([])
  const [currentSubtitle, setCurrentSubtitle] = useState({ en: '', zh: '', number: null })
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1)
  const [audioTime, setAudioTime] = useState(0)
  const [status, setStatus] = useState({ message: '选择电台开始播放', type: 'info' })
  const [subtitleStartTime, setSubtitleStartTime] = useState(null)
  const [subtitleTimeRemaining, setSubtitleTimeRemaining] = useState(null)
  const [subtitleExpired, setSubtitleExpired] = useState(false)

  // Refs
  const audioRef = useRef(null)
  const eventSourceRef = useRef(null)
  const clientIdRef = useRef(null)
  const heartbeatIntervalRef = useRef(null)
  const updateIntervalRef = useRef(null)
  const subtitleListRef = useRef(null)
  const subtitleTimerRef = useRef(null)
  const countdownIntervalRef = useRef(null)

  useEffect(() => {
    fetchStations()
    return () => {
      disconnect()
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStations(stations)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = stations.filter(station =>
        station.name.toLowerCase().includes(query) ||
        station.id.toLowerCase().includes(query)
      )
      setFilteredStations(filtered)
    }
  }, [searchQuery, stations])

  // Update subtitles based on audio time
  useEffect(() => {
    if (currentStation && isConnected) {
      updateIntervalRef.current = setInterval(updateSubtitle, 100)
      return () => {
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current)
        }
      }
    }
  }, [subtitleQueue, currentStation, isConnected])

  // Auto-scroll to latest subtitle
  useEffect(() => {
    if (subtitleListRef.current && subtitleQueue.length > 0) {
      subtitleListRef.current.scrollTop = subtitleListRef.current.scrollHeight
    }
  }, [subtitleQueue.length])

  const fetchStations = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/stations/streams`)
      setStations(response.data.stations || [])
      setFilteredStations(response.data.stations || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching stations:', err)
      setError('Failed to load radio stations')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = (message, type = 'info') => {
    setStatus({ message, type })
    console.log(`[${type.toUpperCase()}] ${message}`)
  }

  // Check if user is premium member
  const isPremiumUser = () => {
    return user && user.subscriptionStatus === 'active'
  }

  // Start subtitle timer for free users
  const startSubtitleTimer = () => {
    if (isPremiumUser()) {
      return // Premium users have unlimited access
    }

    const startTime = Date.now()
    setSubtitleStartTime(startTime)
    setSubtitleTimeRemaining(FREE_SUBTITLE_DURATION)

    // Update countdown every second
    countdownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = FREE_SUBTITLE_DURATION - elapsed

      if (remaining <= 0) {
        stopSubtitles()
      } else {
        setSubtitleTimeRemaining(remaining)
      }
    }, 1000)

    // Stop subtitles after 2 minutes for free users
    subtitleTimerRef.current = setTimeout(() => {
      stopSubtitles()
    }, FREE_SUBTITLE_DURATION)
  }

  // Stop subtitles but keep audio playing
  const stopSubtitles = () => {
    console.log('⏱️ 字幕时间已用完（免费用户限制2分钟）')

    // Clear timers
    if (subtitleTimerRef.current) {
      clearTimeout(subtitleTimerRef.current)
      subtitleTimerRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }

    // Stop SSE connection and heartbeat
    stopHeartbeat()
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    // Notify server disconnect
    if (clientIdRef.current && currentStation) {
      axios.post(`${SSE_API_BASE_URL}/api/client/disconnect`, {
        client_id: clientIdRef.current,
        channel: `station:${currentStation.id}`
      }).catch(err => console.error('⚠️ 通知服务器断开失败:', err))
    }

    clientIdRef.current = null
    setSubtitleStartTime(null)
    setSubtitleTimeRemaining(null)
    setSubtitleExpired(true)

    updateStatus('字幕时间已用完，音频继续播放（升级会员享受无限制字幕）', 'info')

    // Keep isConnected as false to show upgrade prompt
    setIsConnected(false)
  }

  const updateSubtitle = () => {
    if (subtitleQueue.length === 0 || !audioRef.current) return

    const currentTimeMs = audioRef.current.currentTime * 1000

    let foundIndex = -1
    for (let i = 0; i < subtitleQueue.length; i++) {
      const subtitle = subtitleQueue[i]
      const startTime = subtitle.offset
      const endTime = subtitle.offset + subtitle.duration

      if (currentTimeMs >= startTime && currentTimeMs < endTime) {
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

  const handlePlayStation = async (station) => {
    if (currentStation?.id === station.id && isPlaying) {
      disconnect()
      return
    }

    // Disconnect previous station
    if (currentStation) {
      disconnect()
    }

    setCurrentStation(station)
    setIsPlaying(true)
    setSubtitleQueue([])
    setCurrentSubtitleIndex(-1)
    setCurrentSubtitle({ en: '正在连接...', zh: '', number: null })
    setSubtitleExpired(false)

    console.log('🎙️ 准备连接电台:', station)
    updateStatus(`正在连接 ${station.name}...`, 'info')

    try {
      // Step 1: Get token
      const connectUrl = `${SSE_API_BASE_URL}/sse/connect?station_code=${station.id}`
      const response = await axios.get(connectUrl)
      console.log('✅ 获取到连接信息:', response.data)

      // Step 2: Establish SSE connection
      updateStatus('正在建立 SSE 连接...', 'info')

      const sseUrl = new URL(CENTRIFUGO_SSE_URL)
      sseUrl.searchParams.append('cf_connect', JSON.stringify({
        token: response.data.token
      }))

      eventSourceRef.current = new EventSource(sseUrl)

      eventSourceRef.current.onopen = () => {
        updateStatus('SSE 连接已建立', 'connected')
      }

      eventSourceRef.current.onmessage = (event) => {
        if (event.data === '{}') return

        try {
          const msg = JSON.parse(event.data)

          // Connection success
          if (msg.connect) {
            clientIdRef.current = msg.connect.client
            console.log('✅ Centrifugo 连接成功, Client ID:', clientIdRef.current)
            updateStatus(`已连接到 ${station.name}`, 'connected')
            setIsConnected(true)

            // Step 3: Subscribe to station
            startStation(station).then(() => {
              startHeartbeat(station)
              startSubtitleTimer() // Start subtitle timer for free users
            }).catch(err => {
              console.error('订阅失败:', err)
            })
          }

          // Receive subtitle data
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
              setCurrentSubtitle({ en: '等待字幕...', zh: '', number: null })
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
              setCurrentSubtitle({ en: '❌ 音频源无法连接', zh: pushData.message, number: null })
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

      // Load audio stream
      if (audioRef.current) {
        const audio = audioRef.current

        audio.addEventListener('error', (e) => {
          console.error('音频加载错误:', e)
          updateStatus('音频加载失败，请检查电台URL', 'error')
        })

        audio.addEventListener('canplay', () => {
          console.log('✅ 音频已准备好播放')
        })

        audio.src = station.stream_url || station.url
        audio.load()

        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ 音频开始播放')
            })
            .catch(err => {
              console.error('音频自动播放失败:', err)
              updateStatus('请手动点击音频播放按钮', 'info')
            })
        }
      }

    } catch (error) {
      console.error('❌ 连接失败:', error)
      updateStatus(`连接失败: ${error.message}`, 'error')
      setCurrentSubtitle({ en: '连接失败', zh: error.message, number: null })
    }
  }

  const startStation = async (station) => {
    try {
      const response = await axios.post(`${SSE_API_BASE_URL}/sse/subscribe`, {
        station_code: station.id,
        client_id: clientIdRef.current
      })
      console.log('✅ 电台启动:', response.data.message)
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
      await axios.post(`${SSE_API_BASE_URL}/api/client/heartbeat`, {
        client_id: clientIdRef.current,
        channel: `station:${station.id}`
      })
      console.log('💓 心跳发送成功')
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
    if (clientIdRef.current && currentStation) {
      try {
        await axios.post(`${SSE_API_BASE_URL}/api/client/disconnect`, {
          client_id: clientIdRef.current,
          channel: `station:${currentStation.id}`
        })
        console.log('✅ 已通知服务器断开连接')
      } catch (error) {
        console.error('⚠️ 通知服务器断开失败:', error)
      }
    }

    stopHeartbeat()

    // Clear subtitle timers
    if (subtitleTimerRef.current) {
      clearTimeout(subtitleTimerRef.current)
      subtitleTimerRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }

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
    setCurrentSubtitle({ en: '选择电台开始播放', zh: '', number: null })
    setSubtitleStartTime(null)
    setSubtitleTimeRemaining(null)
    setSubtitleExpired(false)
    clientIdRef.current = null
    setCurrentStation(null)
    setIsConnected(false)
    setIsPlaying(false)

    updateStatus('已断开连接', 'info')
  }

  const handleClosePlayer = () => {
    disconnect()
  }

  const statusColors = {
    info: 'bg-gray-700',
    connected: 'bg-green-900',
    error: 'bg-red-900'
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>{t('stations.realtimeSubtitleRadio')} - RadioTranslator</title>
        <meta name="description" content={t('stations.subtitle')} />
      </Helmet>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="none"
        className="hidden"
      />

      {/* Subtitle Display Area - Fullscreen when playing */}
      {currentStation && (isConnected || subtitleExpired) && (
        <div className="fixed top-[72px] left-0 right-0 bottom-[88px] z-50 bg-black text-white overflow-hidden flex flex-col">
          <div className="flex-1 flex flex-col h-full">
            {/* Status Bar */}
            <div className={`${statusColors[status.type]} px-4 py-2 flex items-center justify-between text-xs border-b border-gray-800`}>
              <span>{status.message}</span>
              <div className="flex items-center gap-4">
                <span>播放: {audioTime.toFixed(1)}s | 字幕: {subtitleQueue.length} 条</span>
                {!isPremiumUser() && subtitleTimeRemaining !== null && (
                  <span className={`font-semibold ${subtitleTimeRemaining < 30000 ? 'text-red-400' : 'text-yellow-400'}`}>
                    ⏱️ 字幕剩余: {Math.ceil(subtitleTimeRemaining / 1000)}s
                  </span>
                )}
              </div>
              <button
                onClick={disconnect}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-semibold transition-colors"
              >
                断开
              </button>
            </div>

            {/* Scrolling Subtitle List - Auto-scroll to latest */}
            <div
              ref={subtitleListRef}
              className="flex-1 overflow-y-auto scroll-smooth px-4 py-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="max-w-4xl mx-auto space-y-2 pb-4">
                {/* Upgrade Prompt when subtitle expired */}
                {subtitleExpired && (
                  <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-2 border-yellow-600/50 rounded-lg p-8 text-center mb-4">
                    <div className="text-5xl mb-4">⏱️</div>
                    <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                      {i18n.language === 'zh' ? '免费字幕时间已用完' : 'Free Subtitle Time Expired'}
                    </h3>
                    <p className="text-gray-300 text-lg mb-2">
                      {i18n.language === 'zh'
                        ? '您已使用完2分钟的免费字幕服务'
                        : 'You have used your 2-minute free subtitle service'}
                    </p>
                    <p className="text-gray-400 mb-6">
                      {i18n.language === 'zh'
                        ? '音频将继续播放，升级会员即可享受无限制字幕服务'
                        : 'Audio will continue playing. Upgrade to premium for unlimited subtitles'}
                    </p>
                    <a
                      href="/subscription"
                      className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                      {i18n.language === 'zh' ? '🚀 立即升级会员' : '🚀 Upgrade to Premium'}
                    </a>
                    <p className="text-gray-500 text-sm mt-4">
                      {i18n.language === 'zh'
                        ? '会员享有无限字幕时间、更多高级功能'
                        : 'Premium members get unlimited subtitles and more features'}
                    </p>
                  </div>
                )}

                {subtitleQueue.map((subtitle, idx) => {
                  const isActive = idx === currentSubtitleIndex
                  return (
                    <div
                      key={idx}
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'bg-primary/20 border-l-4 border-primary'
                          : 'bg-gray-900/50 border-l-4 border-transparent'
                      } px-4 py-2 rounded-r`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`${
                          isActive ? 'text-primary' : 'text-gray-600'
                        } text-xs font-bold min-w-[40px] flex-shrink-0`}>
                          #{idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={`${
                            isActive ? 'text-white font-semibold' : 'text-gray-500'
                          } text-sm leading-relaxed mb-1`}>
                            {subtitle.text}
                          </div>
                          <div className={`${
                            isActive ? 'text-primary' : 'text-gray-600'
                          } text-sm leading-relaxed`}>
                            {subtitle.translation}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {subtitleQueue.length === 0 && !subtitleExpired && (
                  <div className="text-center text-gray-500 py-20 text-sm">
                    等待字幕...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stations Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Title, Search and Count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
            🎙️ {t('stations.realtimeSubtitleRadio')}
          </h1>

          {/* Search Bar */}
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-sm">
            <div className="relative">
              <input
                type="text"
                placeholder={t('stations.search') || 'Search stations...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-gray-400"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Station Count */}
          {!loading && !error && (
            <p className="text-gray-400 text-sm whitespace-nowrap">
              {filteredStations.length} {filteredStations.length === 1 ? 'station' : 'stations'} found
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-400">Loading stations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={fetchStations}
              className="mt-4 btn-primary"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {filteredStations.map((station) => (
                <div
                  key={station.id}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => handlePlayStation(station)}
                >
                  {/* Logo Container */}
                  <div className="relative mb-2">
                    <div className="w-20 h-20 rounded-full bg-gray-800 shadow-md group-hover:shadow-xl transition-shadow duration-200 flex items-center justify-center overflow-hidden">
                      {station.logo ? (
                        <img
                          src={station.logo}
                          alt={station.name}
                          className="w-full h-full object-cover scale-110"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      ) : (
                        <svg
                          className="w-10 h-10 text-primary/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {currentStation?.id === station.id && isPlaying ? (
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Playing Indicator */}
                    {currentStation?.id === station.id && isPlaying && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      </div>
                    )}
                  </div>

                  {/* Station Name - No Card */}
                  <h3 className="text-xs font-medium text-gray-300 text-center leading-tight px-1">
                    {station.name.replace('Listen to the station ', '').replace(' online now', '')}
                  </h3>
                </div>
              ))}
            </div>

            {filteredStations.length === 0 && !loading && (
              <div className="text-center py-20">
                <svg
                  className="mx-auto w-16 h-16 text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-400 text-lg">No stations found</p>
                <p className="text-gray-500 mt-2">Try a different search term</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Bottom Audio Player Bar */}
      {currentStation && isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-primary-dark text-white shadow-2xl z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Station Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {currentStation.logo && (
                  <img
                    src={currentStation.logo}
                    alt={currentStation.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-lg truncate">
                    {currentStation.name.replace('Listen to the station ', '').replace(' online now', '')}
                  </h4>
                  <p className="text-white/80 text-sm">
                    {isConnected ? '正在播放 • 字幕同步中' : '连接中...'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      if (audioRef.current.paused) {
                        audioRef.current.play()
                      } else {
                        audioRef.current.pause()
                      }
                    }
                  }}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                >
                  {audioRef.current?.paused !== false ? (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  )}
                </button>

                {/* Time Info */}
                <div className="hidden sm:block text-sm text-white/80">
                  {audioTime.toFixed(1)}s
                </div>

                {/* Close Button */}
                <button
                  onClick={disconnect}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RadioStations
