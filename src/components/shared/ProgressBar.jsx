export function ProgressBar({ value, max = 100, size = 'md', showLabel = false, color = 'blue' }) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heights[size]}`}>
        <div
          className={`${colors[color]} ${heights[size]} rounded-full progress-animate`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">
          {percentage}%
        </p>
      )}
    </div>
  )
}
