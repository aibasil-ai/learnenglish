import { useMemo } from 'react'
import { useApp } from '../contexts/AppContext'
import { getLevelById } from '../data'
import { Button, Card } from './shared'

export function ResultScreen() {
  const { state, dispatch } = useApp()

  const level = getLevelById(state.currentLevelId)
  const lastResult = state.quizHistory[state.quizHistory.length - 1]

  const { correct, total, percentage, stars } = useMemo(() => {
    if (!lastResult) return { correct: 0, total: 0, percentage: 0, stars: 0 }

    const pct = lastResult.score
    let s = 0
    if (pct >= 80) s = 3
    else if (pct >= 60) s = 2
    else if (pct >= 40) s = 1

    return {
      correct: lastResult.correct,
      total: lastResult.total,
      percentage: pct,
      stars: s,
    }
  }, [lastResult])

  const passed = percentage >= 80
  const nextLevelUnlocked = passed && level && level.id < 100

  const handleHome = () => {
    dispatch({ type: 'SET_MODE', payload: 'home' })
  }

  const handleRetry = () => {
    dispatch({ type: 'SET_MODE', payload: 'quiz' })
  }

  const handleNextLevel = () => {
    if (!level) return
    dispatch({ type: 'SET_CURRENT_LEVEL', payload: level.id + 1 })
    dispatch({ type: 'SET_MODE', payload: 'learn' })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">{passed ? '🎉' : '💪'}</div>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {passed ? '測驗完成！' : '再接再厲！'}
      </h1>

      <Card className="p-8 my-6">
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${percentage * 3.52} 352`}
              className={
                percentage >= 80
                  ? 'text-green-500'
                  : percentage >= 60
                    ? 'text-yellow-500'
                    : 'text-red-500'
              }
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{percentage}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {correct}/{total}
            </span>
          </div>
        </div>
      </Card>

      <div className="text-3xl mb-2">
        {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-2">
        {stars === 3
          ? '表現優異！'
          : stars === 2
            ? '做得不錯！'
            : stars === 1
              ? '繼續加油！'
              : '需要多練習'}
      </p>

      {nextLevelUnlocked && level && (
        <p className="text-green-500 font-medium mb-6">🔓 已解鎖關卡 {level.id + 1}</p>
      )}

      <div className="w-full space-y-3 mt-4">
        {nextLevelUnlocked && (
          <Button onClick={handleNextLevel} className="w-full" size="lg">
            ▶️ 下一關
          </Button>
        )}

        {!passed && (
          <Button onClick={handleRetry} variant="secondary" className="w-full" size="lg">
            🔄 重新測驗
          </Button>
        )}

        <Button onClick={handleHome} variant="ghost" className="w-full" size="lg">
          🏠 返回首頁
        </Button>
      </div>
    </div>
  )
}
