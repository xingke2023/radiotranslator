function ProductIllustration() {
  return (
    <div className="w-full max-w-5xl mx-auto my-16 px-4">
      <div className="card-elegant p-8 bg-gradient-to-br from-white to-ms-50">
        {/* 模拟的电台播放器界面 */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-ms-lg p-6 mb-6 shadow-ms-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-ms flex items-center justify-center">
                <span className="text-2xl">📻</span>
              </div>
              <div className="text-white">
                <h3 className="font-bold text-lg">BBC World Service</h3>
                <p className="text-sm opacity-80">London, UK</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
                <span className="text-white">▶</span>
              </button>
            </div>
          </div>

          {/* 音频波形动画效果 */}
          <div className="flex gap-1 h-16 items-end justify-center">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/40 rounded-t"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  animation: `wave ${Math.random() * 0.5 + 0.5}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* 实时字幕区域 */}
        <div className="bg-gray-900 rounded-ms-lg p-5 mb-4 shadow-ms">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📝</span>
            <h4 className="text-white font-semibold">实时字幕</h4>
            <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded-ms animate-pulse">LIVE</span>
          </div>
          <div className="space-y-2">
            <p className="text-white/90 text-sm leading-relaxed">
              Welcome to BBC World Service, bringing you the latest news from around the globe...
            </p>
          </div>
        </div>

        {/* 翻译区域 */}
        <div className="bg-gradient-to-br from-primary-light/10 to-accent/10 rounded-ms-lg p-5 shadow-ms">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌐</span>
            <h4 className="text-primary font-semibold">中文翻译</h4>
            <select className="ml-auto text-sm border border-gray-300 rounded-ms px-2 py-1 bg-white">
              <option>中文</option>
              <option>日本語</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-gray-800 text-sm leading-relaxed">
              欢迎收听 BBC 国际广播，为您带来全球最新新闻...
            </p>
          </div>
        </div>

        {/* 更多电台列表 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">📡</span>
            更多热门电台
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'NPR News', location: 'USA', emoji: '🇺🇸' },
              { name: 'France Inter', location: 'France', emoji: '🇫🇷' },
              { name: 'NHK World', location: 'Japan', emoji: '🇯🇵' },
              { name: 'Deutsche Welle', location: 'Germany', emoji: '🇩🇪' },
            ].map((station, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-ms p-3 hover:shadow-ms hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{station.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-sm text-gray-800 truncate group-hover:text-primary transition-colors">
                      {station.name}
                    </h5>
                    <p className="text-xs text-gray-500">{station.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          from {
            height: 20%;
          }
          to {
            height: 80%;
          }
        }
      `}</style>
    </div>
  )
}

export default ProductIllustration
