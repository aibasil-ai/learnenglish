import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Button, Card } from './shared'

export function SettingsScreen() {
  const { state, dispatch } = useApp()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleBack = () => {
    dispatch({ type: 'SET_MODE', payload: 'home' })
  }

  const handleResetProgress = () => {
    localStorage.removeItem('englishLearningApp')
    window.location.reload()
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ← 返回
        </button>
        <h1 className="font-semibold text-gray-800 dark:text-gray-100">設定</h1>
        <div className="w-16" />
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-3">發音口音</h3>
          <div className="flex gap-3">
            <Button
              variant={state.accentType === 'us' ? 'primary' : 'secondary'}
              onClick={() => dispatch({ type: 'SET_ACCENT', payload: 'us' })}
            >
              🇺🇸 美式
            </Button>
            <Button
              variant={state.accentType === 'uk' ? 'primary' : 'secondary'}
              onClick={() => dispatch({ type: 'SET_ACCENT', payload: 'uk' })}
            >
              🇬🇧 英式
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">深色模式</h3>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className={`w-14 h-8 rounded-full transition-colors ${
                state.darkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  state.darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-3">學習統計</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>已學單字: {state.learnedWords.length}</p>
            <p>完成關卡: {state.completedLevels.length}</p>
            <p>測驗次數: {state.stats.totalQuizzesTaken}</p>
            <p>
              平均正確率:{' '}
              {state.stats.totalQuestions > 0
                ? Math.round((state.stats.totalCorrect / state.stats.totalQuestions) * 100)
                : 0}
              %
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-red-600 dark:text-red-400 mb-3">重置進度</h3>
          {!showResetConfirm ? (
            <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
              清除所有學習記錄
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                確定要清除所有進度嗎？此操作無法復原。
              </p>
              <div className="flex gap-3">
                <Button variant="danger" onClick={handleResetProgress}>
                  確定清除
                </Button>
                <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>
                  取消
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
