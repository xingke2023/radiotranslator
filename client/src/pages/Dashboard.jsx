import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user, loading, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">加载中...</div>
  }

  if (!user) {
    return null
  }

  const getSubscriptionStatus = () => {
    if (user.subscriptionStatus === 'active') {
      return '有效'
    }
    return '未订阅'
  }

  const getSubscriptionTierName = () => {
    const tiers = {
      free: '免费版',
      basic: '基础会员',
      premium: '高级会员'
    }
    return tiers[user.subscriptionTier] || '免费版'
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      await deleteAccount()
      navigate('/')
    } catch (error) {
      alert('账户注销失败，请稍后再试')
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">会员专区</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-200">个人信息</h2>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 text-sm sm:text-base">
              <span className="font-semibold text-gray-500">用户名：</span>
              <span className="truncate ml-2">{user.username}</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 text-sm sm:text-base">
              <span className="font-semibold text-gray-500">邮箱：</span>
              <span className="truncate ml-2">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 text-sm sm:text-base">
              <span className="font-semibold text-gray-500">首选语言：</span>
              <span>{user.preferredLanguage === 'zh' ? '中文' : user.preferredLanguage}</span>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-200">订阅信息</h2>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 text-sm sm:text-base">
              <span className="font-semibold text-gray-500">当前方案：</span>
              <span className="bg-gradient-to-r from-primary to-secondary text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {getSubscriptionTierName()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 text-sm sm:text-base">
              <span className="font-semibold text-gray-500">订阅状态：</span>
              <span className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                user.subscriptionStatus === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {getSubscriptionStatus()}
              </span>
            </div>
            {user.subscriptionExpiresAt && (
              <div className="flex justify-between items-center py-2 sm:py-3 text-sm sm:text-base">
                <span className="font-semibold text-gray-500">到期时间：</span>
                <span>{new Date(user.subscriptionExpiresAt).toLocaleDateString('zh-CN')}</span>
              </div>
            )}
            {user.subscriptionTier === 'free' && (
              <button
                className="w-full mt-4 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 sm:py-3.5 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 text-sm sm:text-base"
                onClick={() => navigate('/pricing')}
              >
                升级会员
              </button>
            )}
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-200">会员特权</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
              {user.subscriptionTier === 'free' && (
                <>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg opacity-50">
                    <span className="text-xl sm:text-2xl">❌</span>
                    <p className="text-xs sm:text-sm font-medium">高级电台访问</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg opacity-50">
                    <span className="text-xl sm:text-2xl">❌</span>
                    <p className="text-xs sm:text-sm font-medium">多语言翻译</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg opacity-50">
                    <span className="text-xl sm:text-2xl">❌</span>
                    <p className="text-xs sm:text-sm font-medium">离线下载</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg opacity-50">
                    <span className="text-xl sm:text-2xl">❌</span>
                    <p className="text-xs sm:text-sm font-medium">无广告体验</p>
                  </div>
                </>
              )}
              {user.subscriptionTier === 'basic' && (
                <>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <p className="text-xs sm:text-sm font-medium">基础电台访问</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <p className="text-xs sm:text-sm font-medium">实时字幕</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <p className="text-xs sm:text-sm font-medium">单语言翻译</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg opacity-50">
                    <span className="text-xl sm:text-2xl">❌</span>
                    <p className="text-xs sm:text-sm font-medium">离线下载</p>
                  </div>
                </>
              )}
              {user.subscriptionTier === 'premium' && (
                <>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <p className="text-xs sm:text-sm font-medium">所有电台访问</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <p className="text-xs sm:text-sm font-medium">实时字幕</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <p className="text-xs sm:text-sm font-medium">多语言翻译</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <p className="text-xs sm:text-sm font-medium">离线下载</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <p className="text-xs sm:text-sm font-medium">高清音质</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <p className="text-xs sm:text-sm font-medium">无广告体验</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-xl shadow-md lg:col-span-2 border-2 border-red-200">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-red-200 text-red-600">危险区域</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">注销账户</h3>
                <p className="text-xs sm:text-sm text-gray-600">永久删除您的账户和所有相关数据。此操作无法撤销。</p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 text-sm sm:text-base whitespace-nowrap"
              >
                注销账户
              </button>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full mx-4">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-red-600">确认注销账户</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-6">
                您确定要注销您的账户吗？此操作将：
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 mb-6 space-y-2">
                <li>永久删除您的个人信息</li>
                <li>取消所有订阅</li>
                <li>删除所有保存的数据</li>
                <li>此操作无法撤销</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 text-sm sm:text-base"
                >
                  取消
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 text-sm sm:text-base"
                >
                  {isDeleting ? '正在注销...' : '确认注销'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
