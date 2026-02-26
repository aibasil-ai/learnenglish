import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import { getLevelById, getLevelMetaById } from '../data'
import { Button, ProgressBar, WordCard } from './shared'

export function LevelScreen() {
  const { state, dispatch } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)

  const level = getLevelById(state.currentLevelId)
  const levelMeta = level ? getLevelMetaById(level.id) : null
  const words = level?.words || []
  const currentWord = words[currentIndex]

  const levelProgress = state.levelProgress[level?.id] || { learned: [] }
  const learnedInLevel = levelProgress.learned || []
  const progress = words.length > 0 ? Math.round((learnedInLevel.length / words.length) * 100) : 0
  const allLearned = words.length > 0 && learnedInLevel.length === words.length

  useEffect(() => {
    if (!level || !currentWord) return

    if (!learnedInLevel.includes(currentWord.id)) {
      dispatch({
        type: 'UPDATE_LEVEL_PROGRESS',
        payload: {
          levelId: level.id,
          progress: { learned: [...learnedInLevel, currentWord.id] },
        },
      })
      dispatch({ type: 'ADD_LEARNED_WORD', payload: currentWord.id })
    }
  }, [currentIndex, currentWord, level, learnedInLevel, dispatch])

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const handleStartQuiz = () => {
    dispatch({ type: 'SET_MODE', payload: 'quiz' })
  }

  const handleBack = () => {
    dispatch({ type: 'SET_MODE', payload: 'home' })
  }

  if (!level) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-gray-500 dark:text-gray-400 mb-4">找不到關卡資料。</p>
        <Button onClick={handleBack}>返回首頁</Button>
      </div>
    )
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
        <h1 className="font-semibold text-gray-800 dark:text-gray-100">
          關卡 {levelMeta?.categoryLevel || 1}/{levelMeta?.categoryLevelCount || 5}
        </h1>
        <div className="w-16" />
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          📚 學習進度: {learnedInLevel.length}/{words.length}
        </p>
        <ProgressBar value={progress} />
      </div>

      {currentWord && <WordCard word={currentWord} />}

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="secondary"
          size="lg"
          className="w-16 h-16 text-2xl flex items-center justify-center"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ◀️
        </Button>
        <span className="text-gray-500 dark:text-gray-400">
          {words.length > 0 ? `${currentIndex + 1} / ${words.length}` : '0 / 0'}
        </span>
        <Button
          variant="secondary"
          size="lg"
          className="w-16 h-16 text-2xl flex items-center justify-center"
          onClick={handleNext}
          disabled={words.length === 0 || currentIndex === words.length - 1}
        >
          ▶️
        </Button>
      </div>

      <div className="mt-8">
        <Button onClick={handleStartQuiz} disabled={!allLearned} className="w-full" size="lg">
          📝 {allLearned ? '開始測驗' : '學完全部單字後解鎖測驗'}
        </Button>
      </div>
    </div>
  )
}
