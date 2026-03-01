import { useState, useEffect, useRef } from 'react'

function AudioPlayer({ station, isPlaying, onTogglePlay, onClose }) {
  const audioRef = useRef(null)
  const hlsRef = useRef(null)
  const [volume, setVolume] = useState(0.7)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!station || !station.stream_url) return

    const audio = audioRef.current
    if (!audio) return

    setError(null)
    setLoading(true)

    const streamUrl = station.stream_url

    // Check if stream is HLS (m3u8)
    const isHLS = streamUrl.includes('.m3u8')

    if (isHLS) {
      // Load HLS.js dynamically
      if (window.Hls) {
        if (window.Hls.isSupported()) {
          // Clean up previous HLS instance
          if (hlsRef.current) {
            hlsRef.current.destroy()
          }

          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          })

          hlsRef.current = hls

          hls.loadSource(streamUrl)
          hls.attachMedia(audio)

          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false)
            if (isPlaying) {
              audio.play().catch(err => {
                console.error('HLS play error:', err)
                setError('Failed to play stream')
                setLoading(false)
              })
            }
          })

          hls.on(window.Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data)
            if (data.fatal) {
              setError('Stream playback error')
              setLoading(false)
              switch (data.type) {
                case window.Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad()
                  break
                case window.Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError()
                  break
                default:
                  hls.destroy()
                  break
              }
            }
          })
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          audio.src = streamUrl
          setLoading(false)
          if (isPlaying) {
            audio.play().catch(err => {
              console.error('Native HLS play error:', err)
              setError('Failed to play stream')
              setLoading(false)
            })
          }
        } else {
          setError('HLS not supported in this browser')
          setLoading(false)
        }
      } else {
        // HLS.js not loaded yet, load it
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest'
        script.onload = () => {
          // Retry after loading
          setLoading(false)
        }
        script.onerror = () => {
          setError('Failed to load HLS player')
          setLoading(false)
        }
        document.head.appendChild(script)
      }
    } else {
      // Regular audio stream (MP3, AAC, etc.)
      audio.src = streamUrl
      setLoading(false)

      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Audio play error:', err)
          setError('Failed to play stream')
          setLoading(false)
        })
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [station])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Play error:', err)
        setError('Failed to play stream')
      })
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = volume
    }
  }, [volume])

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value))
  }

  const stationName = station?.name
    ? station.name.replace('Listen to the station ', '').replace(' online now', '')
    : ''

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-primary-dark text-white shadow-2xl z-50 transform transition-transform duration-300">
      <audio
        ref={audioRef}
        onLoadStart={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onError={(e) => {
          console.error('Audio error:', e)
          setError('Failed to load stream')
          setLoading(false)
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Station Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {station?.logo && (
              <img
                src={station.logo}
                alt={stationName}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-lg truncate">{stationName}</h4>
              {error ? (
                <p className="text-red-200 text-sm">{error}</p>
              ) : loading ? (
                <p className="text-white/80 text-sm">Loading stream...</p>
              ) : (
                <p className="text-white/80 text-sm">
                  {isPlaying ? 'Now playing' : 'Paused'}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              disabled={loading || !!error}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-white"
              />
              <span className="text-sm w-10 text-right">{Math.round(volume * 100)}%</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
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
  )
}

export default AudioPlayer
