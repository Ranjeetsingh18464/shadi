export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="relative inline-flex mb-4">
          <span className="text-5xl animate-float">💍</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-rose-200 dark:bg-rose-900 rounded-full animate-pulseSoft"></div>
        </div>
        <h2 className="text-2xl font-bold gradient-text font-display mb-2">lakh_khushiya.com</h2>
        <div className="flex justify-center gap-1.5 mt-3">
          <div className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}
