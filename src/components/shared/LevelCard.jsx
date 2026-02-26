import { Card } from './Card'

export function LevelCard({ level, status, progress, onClick }) {
  // status: 'locked' | 'available' | 'in_progress' | 'completed'

  const statusStyles = {
    locked: 'opacity-60 cursor-not-allowed',
    available: 'cursor-pointer',
    in_progress: 'cursor-pointer ring-2 ring-blue-500',
    completed: 'cursor-pointer',
  }

  const statusIcons = {
    locked: '🔒',
    available: '🔓',
    in_progress: '📖',
    completed: '⭐',
  }

  return (
    <Card
      hover={status !== 'locked'}
      onClick={status !== 'locked' ? onClick : undefined}
      className={`p-4 ${statusStyles[status]}`}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">
          {statusIcons[status]}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            關卡 {level.id}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {level.name}
          </p>
          {status === 'in_progress' && progress !== undefined && (
            <div className="mt-2">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-1.5 bg-blue-500 rounded-full progress-animate"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-400">
          {level.words.length} 字
        </div>
      </div>
    </Card>
  )
}
