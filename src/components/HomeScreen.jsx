import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { allLevels, totalWords, levelGroups, categoryStartLevelIds } from '../data'
import { Button, Card, ProgressBar, LevelCard } from './shared'

export function HomeScreen() {
  const { state, dispatch } = useApp()
  const [openGroupIndex, setOpenGroupIndex] = useState(0)
  const [expandAll, setExpandAll] = useState(false)

  const learnedCount = state.learnedWords.length
  const progress = Math.round((learnedCount / totalWords) * 100)
  const latestLearningLevelId = useMemo(() => {
    if (state.currentLevelId) return state.currentLevelId

    const learnedLevelIds = Object.entries(state.levelProgress)
      .filter(([, value]) => (value?.learned?.length || 0) > 0)
      .map(([levelId]) => Number(levelId))
      .filter((levelId) => !Number.isNaN(levelId))

    if (learnedLevelIds.length > 0) return Math.max(...learnedLevelIds)
    return categoryStartLevelIds[0] || 1
  }, [state.currentLevelId, state.levelProgress])

  const activeGroupIndex = useMemo(() => {
    const index = levelGroups.findIndex((group) =>
      group.levels.some((level) => level.id === latestLearningLevelId),
    )
    return index >= 0 ? index : 0
  }, [latestLearningLevelId])

  useEffect(() => {
    if (!expandAll) {
      setOpenGroupIndex(activeGroupIndex)
    }
  }, [activeGroupIndex, expandAll])

  const getLevelStatus = (levelId) => {
    if (state.completedLevels.includes(levelId)) return 'completed'
    if (state.unlockedLevels.includes(levelId)) {
      const levelProg = state.levelProgress[levelId]
      if (levelProg?.learned?.length > 0) return 'in_progress'
      return 'available'
    }
    return 'locked'
  }

  const getLevelProgress = (levelId) => {
    const level = allLevels.find((l) => l.id === levelId)
    const learned = state.levelProgress[levelId]?.learned?.length || 0
    return Math.round((learned / level.words.length) * 100)
  }

  const handleLevelClick = (level) => {
    dispatch({ type: 'SET_CURRENT_LEVEL', payload: level.id })
    dispatch({ type: 'SET_MODE', payload: 'learn' })
  }

  const getGroupProgress = (group) => {
    const learned = group.levels.reduce(
      (sum, level) => sum + (state.levelProgress[level.id]?.learned?.length || 0),
      0,
    )
    const wordTotal = group.levels.reduce((sum, level) => sum + level.words.length, 0)
    return wordTotal > 0 ? Math.round((learned / wordTotal) * 100) : 0
  }

  const getGroupStats = (group) => {
    const unlocked = group.levels.filter((level) => state.unlockedLevels.includes(level.id)).length
    const completed = group.levels.filter((level) =>
      state.completedLevels.includes(level.id),
    ).length
    return { unlocked, completed }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => dispatch({ type: 'SET_MODE', payload: 'settings' })}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ⚙️
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {state.darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          🎓 英文單字大挑戰
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          已學 {learnedCount} / {totalWords} 單字
        </p>
        <ProgressBar value={progress} showLabel />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          章節清單（每章 5 關）
        </h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setExpandAll(false)
              setOpenGroupIndex(activeGroupIndex)
            }}
          >
            目前進度
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpandAll((prev) => !prev)}
          >
            {expandAll ? '全部收合' : '全部展開'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {levelGroups.map((group, index) => {
          const isOpen = expandAll || index === openGroupIndex
          const startLevel = group.levels[0].id
          const groupProgress = getGroupProgress(group)
          const groupStats = getGroupStats(group)

          return (
            <Card key={`${group.category}-${startLevel}`} className="overflow-hidden">
              <button
                onClick={() => {
                  setExpandAll(false)
                  setOpenGroupIndex(index)
                }}
                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      關卡 1 - {group.levels.length}
                    </p>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {group.category}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      已解鎖 {groupStats.unlocked}/{group.levels.length} ・ 已完成{' '}
                      {groupStats.completed}/{group.levels.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {groupProgress}%
                    </p>
                    <p className="text-lg text-gray-400">{isOpen ? '▴' : '▾'}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar value={groupProgress} size="sm" />
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                  {group.levels.map((level, levelIndex) => (
                    <LevelCard
                      key={level.id}
                      level={level}
                      levelNumber={levelIndex + 1}
                      status={getLevelStatus(level.id)}
                      progress={getLevelProgress(level.id)}
                      onClick={() => handleLevelClick(level)}
                    />
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
