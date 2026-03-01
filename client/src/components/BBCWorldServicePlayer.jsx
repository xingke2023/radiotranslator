import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const SSE_API_BASE_URL = 'https://radio.xingke888.com/sse8'
const FREE_SUBTITLE_DURATION = 120000 // 2 minutes in milliseconds

// BBC World Service 电台配置
const BBC_STATION = {
  id: 'bbcworldservice',
  name: 'BBC World Service',
  url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
  country: 'United Kingdom',
  language: 'English'
}

function BBCWorldServicePlayer() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const audioRef = useRef(null)
  const eventSourceRef = useRef(null)
  const clientIdRef = useRef(null)
  const heartbeatIntervalRef = useRef(null)
  const subtitleTimerRef = useRef(null)
  const countdownIntervalRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [subtitleQueue, setSubtitleQueue] = useState([])
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1)
  const [currentSubtitle, setCurrentSubtitle] = useState({
    en: i18n.language === 'zh' ? '点击播放按钮开始收听 BBC World Service' : 'Click play to start listening to BBC World Service',
    zh: '',
    number: null
  })
  const [volume, setVolume] = useState(0.7)
  const [statusMessage, setStatusMessage] = useState('')
  const [subtitleStartTime, setSubtitleStartTime] = useState(null)
  const [subtitleTimeRemaining, setSubtitleTimeRemaining] = useState(null)
  const [subtitleExpired, setSubtitleExpired] = useState(false)
  const [audioTime, setAudioTime] = useState(0)
  const [offsetValue, setOffsetValue] = useState(0)
  const updateIntervalRef = useRef(null)
  const subtitleListRef = useRef(null)

  // Check if user has premium access
  const isPremiumUser = user && user.subscription_status === 'active'

  // Update status message
  const updateStatus = (message, type = 'info') => {
    setStatusMessage(message)
    console.log(`[${type.toUpperCase()}] ${message}`)
  }

  // Start heartbeat to keep connection alive
  const startHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    heartbeatIntervalRef.current = setInterval(() => {
      if (clientIdRef.current) {
        axios.post(`${SSE_API_BASE_URL}/api/client/heartbeat`, {
          client_id: clientIdRef.current,
          channel: `station:${BBC_STATION.id}`
        }).catch(err => console.error('⚠️ Heartbeat failed:', err))
      }
    }, 30000) // Every 30 seconds
  }

  // Stop heartbeat
  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
  }

  // Stop subtitles (for free users after 2 minutes)
  const stopSubtitles = () => {
    console.log('⏱️ Subtitle time expired (free user 2-minute limit)')

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
    if (clientIdRef.current) {
      axios.post(`${SSE_API_BASE_URL}/api/client/disconnect`, {
        client_id: clientIdRef.current,
        channel: `station:${BBC_STATION.id}`
      }).catch(err => console.error('⚠️ Failed to notify server disconnect:', err))
    }

    clientIdRef.current = null
    setSubtitleStartTime(null)
    setSubtitleTimeRemaining(null)
    setSubtitleExpired(true)

    updateStatus(
      i18n.language === 'zh'
        ? '字幕时间已用完，音频继续播放（升级会员享受无限制字幕）'
        : 'Subtitle time expired, audio continues (upgrade for unlimited subtitles)',
      'info'
    )

    setIsConnected(false)
  }

  // Connect to subtitle stream
  const connectToSubtitleStream = async () => {
    try {
      // Step 1: Get connection token
      const connectUrl = `${SSE_API_BASE_URL}/sse/connect?station_code=${BBC_STATION.id}`
      const response = await axios.get(connectUrl)
      console.log('✅ Got connection info:', response.data)

      const token = response.data.token
      if (!token) {
        throw new Error('No token received from server')
      }

      // Step 2: Setup SSE connection with Centrifugo
      const CENTRIFUGO_SSE_URL = 'https://radio.xingke888.com/centrifugo/connection/uni_sse'
      const sseUrl = new URL(CENTRIFUGO_SSE_URL)
      sseUrl.searchParams.append('cf_connect', JSON.stringify({
        token: token
      }))

      const eventSource = new EventSource(sseUrl.toString())
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log('✅ SSE connection opened')
      }

      eventSource.onmessage = (event) => {
        if (event.data === '{}') return

        try {
          const msg = JSON.parse(event.data)

          // Connection established
          if (msg.connect) {
            clientIdRef.current = msg.connect.client
            console.log('✅ Centrifugo connected, Client ID:', clientIdRef.current)
            setIsConnected(true)

            // Subscribe to station
            axios.post(`${SSE_API_BASE_URL}/sse/subscribe`, {
              station_code: BBC_STATION.id,
              client_id: clientIdRef.current
            }).then(() => {
              console.log('✅ Subscribed to station')
              startHeartbeat()

              // Start timer for free users
              if (!isPremiumUser) {
                setSubtitleStartTime(Date.now())
                setSubtitleTimeRemaining(FREE_SUBTITLE_DURATION)

                // Update countdown every second
                countdownIntervalRef.current = setInterval(() => {
                  setSubtitleTimeRemaining(prev => {
                    if (prev === null) return null
                    const newTime = prev - 1000
                    if (newTime <= 0) {
                      clearInterval(countdownIntervalRef.current)
                      return 0
                    }
                    return newTime
                  })
                }, 1000)

                // Set timer to stop subtitles after 2 minutes
                subtitleTimerRef.current = setTimeout(() => {
                  stopSubtitles()
                }, FREE_SUBTITLE_DURATION)

                updateStatus(
                  i18n.language === 'zh'
                    ? '✅ 已连接字幕流（免费用户：2分钟）'
                    : '✅ Connected to subtitle stream (free user: 2 minutes)',
                  'success'
                )
              } else {
                updateStatus(
                  i18n.language === 'zh'
                    ? '✅ 已连接字幕流（会员：无限制）'
                    : '✅ Connected to subtitle stream (premium: unlimited)',
                  'success'
                )
              }
            }).catch(err => {
              console.error('❌ Subscription failed:', err)
              updateStatus(
                i18n.language === 'zh'
                  ? '订阅失败'
                  : 'Subscription failed',
                'error'
              )
            })
          }

          // Received subtitle data
          if (msg.pub && msg.pub.data) {
            const pushData = msg.pub.data

            if (pushData.event === 'recognized') {
              console.log('📝 Received subtitle:', pushData)

              const translation = pushData.translations && pushData.translations['zh-CN']
                ? pushData.translations['zh-CN']
                : ''

              setSubtitleQueue(prev => [...prev, {
                en: pushData.text,
                zh: translation,
                offset: pushData.offset,
                duration: pushData.duration,
                timestamp: pushData.timestamp
              }])
            }
            else if (pushData.event === 'started') {
              console.log('🚀 Recognition started')
              updateStatus(
                i18n.language === 'zh'
                  ? 'BBC 识别已启动，等待字幕...'
                  : 'Recognition started, waiting for subtitles...',
                'info'
              )
            }
            else if (pushData.event === 'reconnecting') {
              console.log('🔄 Reconnecting...')
              updateStatus(
                i18n.language === 'zh'
                  ? '正在重连...'
                  : 'Reconnecting...',
                'info'
              )
            }
            else if (pushData.event === 'audioSourceFailed') {
              console.error('❌ Audio source failed:', pushData)
              updateStatus(
                i18n.language === 'zh'
                  ? '❌ 音频源连接失败'
                  : '❌ Audio source failed',
                'error'
              )
            }
          }
        } catch (err) {
          console.error('⚠️ Error parsing SSE message:', err)
        }
      }

      eventSource.onerror = (error) => {
        console.error('❌ SSE error:', error)
        eventSource.close()
        setIsConnected(false)
        stopHeartbeat()
        updateStatus(
          i18n.language === 'zh'
            ? '字幕连接已断开'
            : 'Subtitle connection lost',
          'error'
        )
      }

    } catch (error) {
      console.error('❌ Failed to connect to subtitle stream:', error)
      updateStatus(
        i18n.language === 'zh'
          ? '字幕连接失败'
          : 'Failed to connect to subtitles',
        'error'
      )
    }
  }

  // Handle play/pause
  const handlePlayPause = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      // Pause
      audioRef.current.pause()
      setIsPlaying(false)

      // Disconnect subtitles
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      stopHeartbeat()

      if (subtitleTimerRef.current) {
        clearTimeout(subtitleTimerRef.current)
        subtitleTimerRef.current = null
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = null
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
        updateIntervalRef.current = null
      }

      setIsConnected(false)
      setSubtitleQueue([])
      setCurrentSubtitleIndex(-1)
      setCurrentSubtitle({
        en: i18n.language === 'zh' ? '已暂停' : 'Paused',
        zh: '',
        number: null
      })
      setSubtitleStartTime(null)
      setSubtitleTimeRemaining(null)
      setSubtitleExpired(false)
    } else {
      // Play
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setSubtitleExpired(false)
        setCurrentSubtitle({
          en: i18n.language === 'zh' ? '正在连接...' : 'Connecting...',
          zh: '',
          number: null
        })

        // Connect to subtitle stream
        await connectToSubtitleStream()
      } catch (error) {
        console.error('❌ Failed to play audio:', error)
        updateStatus(
          i18n.language === 'zh'
            ? '播放失败'
            : 'Failed to play',
          'error'
        )
      }
    }
  }

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Sync subtitles with audio time
  useEffect(() => {
    if (!isPlaying || subtitleQueue.length === 0) return

    const syncSubtitles = () => {
      if (!audioRef.current) return

      const currentTimeMs = audioRef.current.currentTime * 1000
      const adjustedTimeMs = currentTimeMs + offsetValue

      let foundIndex = -1
      for (let i = subtitleQueue.length - 1; i >= 0; i--) {
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
          en: subtitle.en,
          zh: subtitle.zh,
          number: foundIndex + 1
        })
        console.log(`📺 Display subtitle [${foundIndex}]: ${subtitle.en}`)
      }

      setAudioTime(audioRef.current.currentTime)
    }

    updateIntervalRef.current = setInterval(syncSubtitles, 100)

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [isPlaying, subtitleQueue, currentSubtitleIndex, offsetValue])

  // Auto-scroll to current subtitle
  useEffect(() => {
    if (currentSubtitleIndex >= 0 && subtitleListRef.current) {
      const activeElement = subtitleListRef.current.querySelector('.border-primary')
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [currentSubtitleIndex])

  // Format time remaining
  const formatTimeRemaining = (ms) => {
    if (ms === null || ms < 0) return '0:00'
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      stopHeartbeat()
      if (subtitleTimerRef.current) {
        clearTimeout(subtitleTimerRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [])

  return (
    <section className="w-full max-w-5xl mx-auto my-16 px-4">
      <div className="card-elegant p-8 bg-gradient-to-br from-white to-ms-50">
        {/* Audio Player */}
        <audio
          ref={audioRef}
          src={BBC_STATION.url}
          preload="none"
        />

        {/* Player Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-ms-lg p-6 mb-6 shadow-ms-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-ms flex items-center justify-center">
                <span className="text-2xl">📻</span>
              </div>
              <div className="text-white">
                <h3 className="font-bold text-lg">BBC World Service</h3>
                <p className="text-sm opacity-80">
                  {i18n.language === 'zh' ? '伦敦, 英国' : 'London, UK'}
                  {isPlaying && <span className="ml-2 text-xs bg-red-500 px-2 py-1 rounded-ms animate-pulse">LIVE</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Volume Control */}
              <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-ms px-3 py-2">
                <span className="text-white text-sm">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <span className="text-white text-xl">
                  {isPlaying ? '⏸' : '▶'}
                </span>
              </button>
            </div>
          </div>
          {/* Status Message */}
          {statusMessage && (
            <div className="text-sm text-white/80 bg-white/10 rounded-ms px-4 py-2">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Real-time Subtitles Area */}
        <div className="bg-gray-900 rounded-ms-lg p-5 mb-4 shadow-ms">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📝</span>
            <h4 className="text-white font-semibold">
              {i18n.language === 'zh' ? '实时字幕' : 'Live Subtitles'}
            </h4>
            {!isPremiumUser && isConnected && subtitleTimeRemaining !== null && (
              <span className="ml-auto text-xs bg-yellow-500 text-white px-2 py-1 rounded-ms">
                ⏱️ {formatTimeRemaining(subtitleTimeRemaining)}
              </span>
            )}
          </div>

          {subtitleExpired ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">⏱️</div>
              <p className="text-yellow-400 text-lg font-semibold mb-2">
                {i18n.language === 'zh' ? '免费字幕时间已用完' : 'Free Subtitle Time Expired'}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {i18n.language === 'zh'
                  ? '音频继续播放，升级会员享受无限制字幕'
                  : 'Audio continues. Upgrade for unlimited subtitles'}
              </p>
              <a
                href="/pricing"
                className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-ms transition-all transform hover:scale-105 shadow-ms text-sm"
              >
                {i18n.language === 'zh' ? '🚀 升级会员' : '🚀 Upgrade Now'}
              </a>
            </div>
          ) : subtitleQueue.length > 0 ? (
            <div ref={subtitleListRef} className="space-y-3 max-h-[500px] overflow-y-auto">
              {subtitleQueue.slice(-40).map((item, idx) => {
                const globalIndex = Math.max(0, subtitleQueue.length - 40) + idx
                const isActive = globalIndex === currentSubtitleIndex
                return (
                  <div
                    key={idx}
                    className={`${
                      isActive ? 'bg-white/10 border-l-4 border-primary' : 'bg-white/5'
                    } rounded-ms p-3 transition-all duration-200`}
                  >
                    <div className={`${
                      isActive ? 'text-white/90' : 'text-white/70'
                    } text-sm leading-relaxed mb-1`}>
                      {item.en}
                    </div>
                    {item.zh && (
                      <div className={`${
                        isActive ? 'text-primary' : 'text-primary/70'
                      } text-sm leading-relaxed`}>
                        {item.zh}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              {isConnected
                ? (i18n.language === 'zh' ? '等待字幕数据...' : 'Waiting for subtitles...')
                : (i18n.language === 'zh' ? '点击播放按钮开始收听' : 'Click play to start listening')
              }
            </div>
          )}
        </div>

        {/* User Status Info */}
        {!isPremiumUser && isPlaying && !subtitleExpired && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-ms-lg p-4 text-sm">
            <p className="text-yellow-800">
              {i18n.language === 'zh'
                ? '💡 您正在使用免费版本，字幕限制2分钟。'
                : '💡 You are using the free version with 2-minute subtitle limit.'}
              {' '}
              <a href="/pricing" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                {i18n.language === 'zh' ? '升级会员' : 'Upgrade now'}
              </a>
              {' '}
              {i18n.language === 'zh'
                ? '享受无限制字幕服务。'
                : 'for unlimited subtitles.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default BBCWorldServicePlayer
