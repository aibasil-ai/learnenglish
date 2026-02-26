import { useEffect } from 'react'

export function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const types = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
  }

  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-enter">
      <div className={`${types[type]} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
        <span>{icons[type]}</span>
        <span>{message}</span>
      </div>
    </div>
  )
}
