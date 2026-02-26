import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { categoryStartLevelIds } from '../data'

const AppContext = createContext()

const initialState = {
  // 設定
  accentType: 'us', // 'us' or 'uk'
  darkMode: true,
  isFullscreen: false,

  // 學習狀態
  mode: 'home', // 'home', 'learn', 'quiz', 'settings', 'result'
  wordCount: 20,
  currentIndex: 0,
  selectedWords: [],

  // 測驗設定
  quizTypes: ['listening', 'meaning', 'word', 'spelling'],
  currentQuizType: 'listening',
  quizQuestions: [],
  currentQuizIndex: 0,
  quizAnswers: [],

  // 學習進度（從 localStorage 載入）
  learnedWords: [],
  quizHistory: [],

  // 關卡進度
  unlockedLevels: categoryStartLevelIds,
  completedLevels: [],
  levelProgress: {},
  currentLevelId: null,
  stats: {
    totalWordsLearned: 0,
    totalQuizzesTaken: 0,
    totalCorrect: 0,
    totalQuestions: 0,
  },
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ACCENT':
      return { ...state, accentType: action.payload }

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }

    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload }

    case 'SET_MODE':
      return { ...state, mode: action.payload }

    case 'SET_WORD_COUNT':
      return { ...state, wordCount: action.payload }

    case 'SET_SELECTED_WORDS':
      return { ...state, selectedWords: action.payload, currentIndex: 0 }

    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload }

    case 'NEXT_WORD':
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.selectedWords.length - 1)
      }

    case 'PREV_WORD':
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0)
      }

    case 'ADD_LEARNED_WORD':
      if (state.learnedWords.includes(action.payload)) {
        return state
      }
      return { ...state, learnedWords: [...state.learnedWords, action.payload] }

    case 'SET_QUIZ_TYPE':
      return { ...state, currentQuizType: action.payload }

    case 'SET_QUIZ_QUESTIONS':
      return {
        ...state,
        quizQuestions: action.payload,
        currentQuizIndex: 0,
        quizAnswers: []
      }

    case 'NEXT_QUIZ_QUESTION':
      return {
        ...state,
        currentQuizIndex: state.currentQuizIndex + 1
      }

    case 'ADD_QUIZ_ANSWER':
      return {
        ...state,
        quizAnswers: [...state.quizAnswers, action.payload]
      }

    case 'SAVE_QUIZ_RESULT':
      return {
        ...state,
        quizHistory: [...state.quizHistory, action.payload]
      }

    case 'LOAD_SAVED_STATE':
      return { ...state, ...action.payload }

    case 'RESET_QUIZ':
      return {
        ...state,
        currentQuizIndex: 0,
        quizAnswers: [],
        quizQuestions: []
      }

    // 關卡進度管理
    case 'SET_CURRENT_LEVEL':
      return { ...state, currentLevelId: action.payload }

    case 'UNLOCK_LEVEL':
      if (state.unlockedLevels.includes(action.payload)) return state
      return {
        ...state,
        unlockedLevels: [...state.unlockedLevels, action.payload].sort((a, b) => a - b)
      }

    case 'COMPLETE_LEVEL':
      if (state.completedLevels.includes(action.payload)) return state
      return {
        ...state,
        completedLevels: [...state.completedLevels, action.payload].sort((a, b) => a - b)
      }

    case 'UPDATE_LEVEL_PROGRESS':
      return {
        ...state,
        levelProgress: {
          ...state.levelProgress,
          [action.payload.levelId]: {
            ...state.levelProgress[action.payload.levelId],
            ...action.payload.progress
          }
        }
      }

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        }
      }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [isStateLoaded, setIsStateLoaded] = useState(false)

  // 載入儲存的狀態
  useEffect(() => {
    const saved = localStorage.getItem('englishLearningApp')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const mergedUnlockedLevels = Array.from(
          new Set([...(parsed.unlockedLevels || []), ...categoryStartLevelIds]),
        ).sort((a, b) => a - b)

        dispatch({
          type: 'LOAD_SAVED_STATE',
          payload: {
            accentType: parsed.accentType ?? 'us',
            darkMode: parsed.darkMode ?? true,
            learnedWords: parsed.learnedWords || [],
            quizHistory: parsed.quizHistory || [],
            unlockedLevels: mergedUnlockedLevels,
            completedLevels: parsed.completedLevels || [],
            levelProgress: parsed.levelProgress || {},
            stats: parsed.stats || { totalWordsLearned: 0, totalQuizzesTaken: 0, totalCorrect: 0, totalQuestions: 0 },
          }
        })
      } catch (e) {
        console.error('Failed to load saved state:', e)
      }
    }

    setIsStateLoaded(true)
  }, [])

  // 儲存狀態變更
  useEffect(() => {
    if (!isStateLoaded) return

    const toSave = {
      accentType: state.accentType,
      darkMode: state.darkMode,
      learnedWords: state.learnedWords,
      quizHistory: state.quizHistory,
      unlockedLevels: state.unlockedLevels,
      completedLevels: state.completedLevels,
      levelProgress: state.levelProgress,
      stats: state.stats,
    }
    localStorage.setItem('englishLearningApp', JSON.stringify(toSave))
  }, [isStateLoaded, state.accentType, state.darkMode, state.learnedWords, state.quizHistory, state.unlockedLevels, state.completedLevels, state.levelProgress, state.stats])

  // 處理深色模式
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.darkMode])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
