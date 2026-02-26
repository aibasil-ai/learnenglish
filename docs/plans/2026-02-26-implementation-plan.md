---
render_with_liquid: false
---

# 英文單字學習 App 實作計畫

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 建立一個遊戲化英文單字學習應用，含 100 個關卡、2000 個新聞常見單字、4 種測驗類型。

**Architecture:** React SPA，使用 AppContext 管理全域狀態，state-based routing 切換頁面，localStorage 儲存進度。單字資料分成 20 個檔案，每個主題一個。

**Tech Stack:** React 18, Vite, Tailwind CSS, Web Speech API

---

## Phase 1: 單字資料庫 (20 個檔案)

### Task 1.1: 建立資料目錄結構

**Files:**
- Create: `src/data/index.js`
- Create: `src/data/levels/` directory

**Step 1: 建立目錄**

```bash
mkdir -p src/data/levels
```

**Step 2: 建立 index.js 整合檔**

```javascript
// src/data/index.js
import { levels as basicLevels } from './levels/01-basic.js'
import { levels as economyLevels } from './levels/02-economy.js'
import { levels as politicsLevels } from './levels/03-politics.js'
import { levels as technologyLevels } from './levels/04-technology.js'
import { levels as societyLevels } from './levels/05-society.js'
import { levels as environmentLevels } from './levels/06-environment.js'
import { levels as healthLevels } from './levels/07-health.js'
import { levels as lawLevels } from './levels/08-law.js'
import { levels as educationLevels } from './levels/09-education.js'
import { levels as mediaLevels } from './levels/10-media.js'
import { levels as militaryLevels } from './levels/11-military.js'
import { levels as sportsLevels } from './levels/12-sports.js'
import { levels as transportLevels } from './levels/13-transport.js'
import { levels as energyLevels } from './levels/14-energy.js'
import { levels as agricultureLevels } from './levels/15-agriculture.js'
import { levels as architectureLevels } from './levels/16-architecture.js'
import { levels as financeLevels } from './levels/17-finance.js'
import { levels as diplomacyLevels } from './levels/18-diplomacy.js'
import { levels as disasterLevels } from './levels/19-disaster.js'
import { levels as advancedLevels } from './levels/20-advanced.js'

export const allLevels = [
  ...basicLevels,
  ...economyLevels,
  ...politicsLevels,
  ...technologyLevels,
  ...societyLevels,
  ...environmentLevels,
  ...healthLevels,
  ...lawLevels,
  ...educationLevels,
  ...mediaLevels,
  ...militaryLevels,
  ...sportsLevels,
  ...transportLevels,
  ...energyLevels,
  ...agricultureLevels,
  ...architectureLevels,
  ...financeLevels,
  ...diplomacyLevels,
  ...disasterLevels,
  ...advancedLevels,
]

export const getLevelById = (id) => allLevels.find(l => l.id === id)
export const getWordById = (wordId) => {
  for (const level of allLevels) {
    const word = level.words.find(w => w.id === wordId)
    if (word) return word
  }
  return null
}
export const totalWords = allLevels.reduce((sum, l) => sum + l.words.length, 0)
export const totalLevels = allLevels.length
```

**Step 3: Commit**

```bash
git add src/data/
git commit -m "feat: add data directory structure"
```

---

### Task 1.2-1.21: 建立 20 個單字資料檔

每個檔案包含 5 個關卡，每關 20 個單字 = 100 個單字/檔案

**資料格式範例：**

```javascript
// src/data/levels/01-basic.js
export const levels = [
  {
    id: 1,
    name: "基礎新聞用語 (一)",
    category: "基礎新聞用語",
    words: [
      {
        id: "w0001",
        word: "government",
        phonetic: "/ˈɡʌvərnmənt/",
        meaning: "政府",
        partOfSpeech: "n.",
        example: "The government announced new policies.",
        exampleMeaning: "政府宣布了新政策。"
      },
      // ... 19 more words
    ]
  },
  // ... 4 more levels
]
```

**檔案清單：**
1. `01-basic.js` - 關卡 1-5 (基礎新聞用語)
2. `02-economy.js` - 關卡 6-10 (經濟與商業)
3. `03-politics.js` - 關卡 11-15 (政治與國際)
4. `04-technology.js` - 關卡 16-20 (科技與創新)
5. `05-society.js` - 關卡 21-25 (社會與生活)
6. `06-environment.js` - 關卡 26-30 (環境與氣候)
7. `07-health.js` - 關卡 31-35 (健康與醫療)
8. `08-law.js` - 關卡 36-40 (法律與司法)
9. `09-education.js` - 關卡 41-45 (教育與文化)
10. `10-media.js` - 關卡 46-50 (媒體與傳播)
11. `11-military.js` - 關卡 51-55 (軍事與安全)
12. `12-sports.js` - 關卡 56-60 (體育與娛樂)
13. `13-transport.js` - 關卡 61-65 (交通與旅遊)
14. `14-energy.js` - 關卡 66-70 (能源與資源)
15. `15-agriculture.js` - 關卡 71-75 (農業與食品)
16. `16-architecture.js` - 關卡 76-80 (建築與城市)
17. `17-finance.js` - 關卡 81-85 (金融與投資)
18. `18-diplomacy.js` - 關卡 86-90 (外交與條約)
19. `19-disaster.js` - 關卡 91-95 (災難與救援)
20. `20-advanced.js` - 關卡 96-100 (進階綜合)

**每個檔案完成後 Commit：**

```bash
git add src/data/levels/XX-name.js
git commit -m "feat: add [category] vocabulary data (levels XX-YY)"
```

---

## Phase 2: 共用元件 (6 個檔案)

### Task 2.1: Button 元件

**Files:**
- Create: `src/components/shared/Button.jsx`

**Step 1: 建立元件**

```jsx
// src/components/shared/Button.jsx
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 btn-press disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/shared/Button.jsx
git commit -m "feat: add Button component"
```

---

### Task 2.2: Card 元件

**Files:**
- Create: `src/components/shared/Card.jsx`

**Step 1: 建立元件**

```jsx
// src/components/shared/Card.jsx
export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800
        rounded-2xl shadow-md
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/shared/Card.jsx
git commit -m "feat: add Card component"
```

---

### Task 2.3: ProgressBar 元件

**Files:**
- Create: `src/components/shared/ProgressBar.jsx`

**Step 1: 建立元件**

```jsx
// src/components/shared/ProgressBar.jsx
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
          style={% raw %}
{{ width: `${percentage}%` }}
{% endraw %}
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
```

**Step 2: Commit**

```bash
git add src/components/shared/ProgressBar.jsx
git commit -m "feat: add ProgressBar component"
```

---

### Task 2.4: LevelCard 元件

**Files:**
- Create: `src/components/shared/LevelCard.jsx`

**Step 1: 建立元件**

```jsx
// src/components/shared/LevelCard.jsx
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
```

**Step 2: Commit**

```bash
git add src/components/shared/LevelCard.jsx
git commit -m "feat: add LevelCard component"
```

---

### Task 2.5: WordCard 元件

**Files:**
- Create: `src/components/shared/WordCard.jsx`

**Step 1: 建立元件**

```jsx
// src/components/shared/WordCard.jsx
import { useState } from 'react'
import { Card } from './Card'
import { useSpeech } from '../../hooks/useSpeech'

export function WordCard({ word, onLearned }) {
  const [flipped, setFlipped] = useState(false)
  const { speak, isSpeaking } = useSpeech()

  const handleSpeak = (e) => {
    e.stopPropagation()
    speak(word.word)
  }

  return (
    <Card
      className="p-6 min-h-[300px] flex flex-col cursor-pointer select-none"
      onClick={() => setFlipped(!flipped)}
    >
      {!flipped ? (
        // 正面：英文單字
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {word.word}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {word.phonetic}
          </p>
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className="p-4 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <span className="text-2xl">{isSpeaking ? '🔊' : '🔈'}</span>
          </button>
          <p className="text-sm text-gray-400 mt-4">
            點擊卡片翻面
          </p>
        </div>
      ) : (
        // 背面：中文解釋
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-blue-500 mb-2">{word.partOfSpeech}</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {word.meaning}
          </h2>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 w-full">
            <p className="text-gray-700 dark:text-gray-300 italic mb-2">
              "{word.example}"
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {word.exampleMeaning}
            </p>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            點擊卡片翻回
          </p>
        </div>
      )}
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/shared/WordCard.jsx
git commit -m "feat: add WordCard component"
```

---

### Task 2.6: Toast 元件

**Files:**
- Create: `src/components/shared/Toast.jsx`

**Step 1: 建立元件**

```jsx
// src/components/shared/Toast.jsx
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
```

**Step 2: 建立 shared/index.js 匯出**

```javascript
// src/components/shared/index.js
export { Button } from './Button'
export { Card } from './Card'
export { ProgressBar } from './ProgressBar'
export { LevelCard } from './LevelCard'
export { WordCard } from './WordCard'
export { Toast } from './Toast'
```

**Step 3: Commit**

```bash
git add src/components/shared/
git commit -m "feat: add Toast component and shared exports"
```

---

## Phase 3: AppContext 擴充

### Task 3.1: 擴充 AppContext

**Files:**
- Modify: `src/contexts/AppContext.jsx`

**Step 1: 更新 initialState 和 reducer**

在現有的 AppContext 中新增關卡進度管理：

```javascript
// 新增到 initialState
unlockedLevels: [1],
completedLevels: [],
levelProgress: {},
currentLevelId: null,
stats: {
  totalWordsLearned: 0,
  totalQuizzesTaken: 0,
  totalCorrect: 0,
  totalQuestions: 0,
},

// 新增 reducer cases
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
```

**Step 2: 更新 localStorage 儲存**

```javascript
// 更新 toSave 物件
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

// 更新 LOAD_SAVED_STATE
unlockedLevels: parsed.unlockedLevels || [1],
completedLevels: parsed.completedLevels || [],
levelProgress: parsed.levelProgress || {},
stats: parsed.stats || { totalWordsLearned: 0, totalQuizzesTaken: 0, totalCorrect: 0, totalQuestions: 0 },
```

**Step 3: Commit**

```bash
git add src/contexts/AppContext.jsx
git commit -m "feat: extend AppContext with level progress management"
```

---

## Phase 4: 頁面元件

### Task 4.1: App.jsx 主元件

**Files:**
- Create: `src/App.jsx`

**Step 1: 建立元件**

```jsx
// src/App.jsx
import { useApp } from './contexts/AppContext'
import { HomeScreen } from './components/HomeScreen'
import { LevelScreen } from './components/LevelScreen'
import { QuizScreen } from './components/Quiz/QuizScreen'
import { ResultScreen } from './components/ResultScreen'
import { SettingsScreen } from './components/SettingsScreen'

function App() {
  const { state } = useApp()

  const renderScreen = () => {
    switch (state.mode) {
      case 'home':
        return <HomeScreen />
      case 'learn':
        return <LevelScreen />
      case 'quiz':
        return <QuizScreen />
      case 'result':
        return <ResultScreen />
      case 'settings':
        return <SettingsScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 safe-top safe-bottom">
      {renderScreen()}
    </div>
  )
}

export default App
```

**Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add App component with routing"
```

---

### Task 4.2: HomeScreen 首頁

**Files:**
- Create: `src/components/HomeScreen.jsx`

**Step 1: 建立元件**

```jsx
// src/components/HomeScreen.jsx
import { useApp } from '../contexts/AppContext'
import { allLevels, totalWords } from '../data'
import { Button, ProgressBar, LevelCard } from './shared'

export function HomeScreen() {
  const { state, dispatch } = useApp()

  const learnedCount = state.learnedWords.length
  const progress = Math.round((learnedCount / totalWords) * 100)

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
    const level = allLevels.find(l => l.id === levelId)
    const learned = state.levelProgress[levelId]?.learned?.length || 0
    return Math.round((learned / level.words.length) * 100)
  }

  const handleLevelClick = (level) => {
    dispatch({ type: 'SET_CURRENT_LEVEL', payload: level.id })
    dispatch({ type: 'SET_MODE', payload: 'learn' })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
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

      {/* Title & Progress */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          🎓 英文單字大挑戰
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          已學 {learnedCount} / {totalWords} 單字
        </p>
        <ProgressBar value={progress} showLabel />
      </div>

      {/* Level List */}
      <div className="space-y-3">
        {allLevels.map(level => (
          <LevelCard
            key={level.id}
            level={level}
            status={getLevelStatus(level.id)}
            progress={getLevelProgress(level.id)}
            onClick={() => handleLevelClick(level)}
          />
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/HomeScreen.jsx
git commit -m "feat: add HomeScreen component"
```

---

### Task 4.3: LevelScreen 關卡頁

**Files:**
- Create: `src/components/LevelScreen.jsx`

**Step 1: 建立元件**

```jsx
// src/components/LevelScreen.jsx
import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import { getLevelById } from '../data'
import { Button, ProgressBar, WordCard } from './shared'

export function LevelScreen() {
  const { state, dispatch } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)

  const level = getLevelById(state.currentLevelId)
  const words = level?.words || []
  const currentWord = words[currentIndex]

  const levelProgress = state.levelProgress[level?.id] || { learned: [] }
  const learnedInLevel = levelProgress.learned || []
  const progress = Math.round((learnedInLevel.length / words.length) * 100)
  const allLearned = learnedInLevel.length === words.length

  useEffect(() => {
    // 標記當前單字為已學習
    if (currentWord && !learnedInLevel.includes(currentWord.id)) {
      dispatch({
        type: 'UPDATE_LEVEL_PROGRESS',
        payload: {
          levelId: level.id,
          progress: { learned: [...learnedInLevel, currentWord.id] }
        }
      })
      dispatch({ type: 'ADD_LEARNED_WORD', payload: currentWord.id })
    }
  }, [currentIndex, currentWord])

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

  if (!level) return null

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ← 返回
        </button>
        <h1 className="font-semibold text-gray-800 dark:text-gray-100">
          關卡 {level.id}
        </h1>
        <div className="w-16" />
      </div>

      {/* Level Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          📚 學習進度: {learnedInLevel.length}/{words.length}
        </p>
        <ProgressBar value={progress} />
      </div>

      {/* Word Card */}
      {currentWord && (
        <WordCard word={currentWord} />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ◀️
        </Button>
        <span className="text-gray-500 dark:text-gray-400">
          {currentIndex + 1} / {words.length}
        </span>
        <Button
          variant="ghost"
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
        >
          ▶️
        </Button>
      </div>

      {/* Start Quiz Button */}
      <div className="mt-8">
        <Button
          onClick={handleStartQuiz}
          disabled={!allLearned}
          className="w-full"
          size="lg"
        >
          📝 {allLearned ? '開始測驗' : `學完全部單字後解鎖測驗`}
        </Button>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/LevelScreen.jsx
git commit -m "feat: add LevelScreen component"
```

---

### Task 4.4: SettingsScreen 設定頁

**Files:**
- Create: `src/components/SettingsScreen.jsx`

**Step 1: 建立元件**

```jsx
// src/components/SettingsScreen.jsx
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ← 返回
        </button>
        <h1 className="font-semibold text-gray-800 dark:text-gray-100">
          設定
        </h1>
        <div className="w-16" />
      </div>

      <div className="space-y-4">
        {/* Accent Setting */}
        <Card className="p-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-3">
            發音口音
          </h3>
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

        {/* Dark Mode */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">
              深色模式
            </h3>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className={`w-14 h-8 rounded-full transition-colors ${
                state.darkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                state.darkMode ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-3">
            學習統計
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>已學單字: {state.learnedWords.length}</p>
            <p>完成關卡: {state.completedLevels.length}</p>
            <p>測驗次數: {state.stats.totalQuizzesTaken}</p>
            <p>平均正確率: {
              state.stats.totalQuestions > 0
                ? Math.round((state.stats.totalCorrect / state.stats.totalQuestions) * 100)
                : 0
            }%</p>
          </div>
        </Card>

        {/* Reset Progress */}
        <Card className="p-4">
          <h3 className="font-medium text-red-600 dark:text-red-400 mb-3">
            重置進度
          </h3>
          {!showResetConfirm ? (
            <Button
              variant="danger"
              onClick={() => setShowResetConfirm(true)}
            >
              清除所有學習記錄
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                確定要清除所有進度嗎？此操作無法復原。
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleResetProgress}
                >
                  確定清除
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowResetConfirm(false)}
                >
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
```

**Step 2: Commit**

```bash
git add src/components/SettingsScreen.jsx
git commit -m "feat: add SettingsScreen component"
```

---

## Phase 5: 測驗系統

### Task 5.1: useQuiz Hook

**Files:**
- Create: `src/hooks/useQuiz.js`

**Step 1: 建立 hook**

```javascript
// src/hooks/useQuiz.js
import { useState, useCallback } from 'react'
import { useApp } from '../contexts/AppContext'
import { getLevelById, allLevels } from '../data'
import { shuffleArray, generateOptions } from '../utils/helpers'

export function useQuiz() {
  const { state, dispatch } = useApp()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)

  const level = getLevelById(state.currentLevelId)

  const generateQuestions = useCallback(() => {
    if (!level) return

    const words = level.words
    const quizTypes = ['listening', 'meaning', 'word', 'spelling']
    const shuffledWords = shuffleArray([...words]).slice(0, 10)

    // 取得所有關卡的單字作為干擾項來源
    const allWords = allLevels.flatMap(l => l.words)

    const newQuestions = shuffledWords.map((word, idx) => {
      const type = quizTypes[idx % quizTypes.length]

      if (type === 'listening' || type === 'meaning') {
        // 中文選項
        const allMeanings = allWords.map(w => w.meaning)
        const options = generateOptions(word.meaning, allMeanings, 4)
        return { type, word, options, correctAnswer: word.meaning }
      } else if (type === 'word') {
        // 英文選項
        const allWordTexts = allWords.map(w => w.word)
        const options = generateOptions(word.word, allWordTexts, 4)
        return { type, word, options, correctAnswer: word.word }
      } else {
        // spelling - 無選項
        return { type, word, options: null, correctAnswer: word.word }
      }
    })

    setQuestions(shuffleArray(newQuestions))
    setCurrentIndex(0)
    setAnswers([])
    setShowResult(false)
  }, [level])

  const submitAnswer = useCallback((answer) => {
    const question = questions[currentIndex]
    const isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()

    const newAnswer = {
      questionIndex: currentIndex,
      question,
      userAnswer: answer,
      isCorrect,
    }

    setAnswers(prev => [...prev, newAnswer])

    return isCorrect
  }, [questions, currentIndex])

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setShowResult(true)
    }
  }, [currentIndex, questions.length])

  const getResults = useCallback(() => {
    const correct = answers.filter(a => a.isCorrect).length
    const total = answers.length
    const percentage = Math.round((correct / total) * 100)
    const passed = percentage >= 80

    return { correct, total, percentage, passed, answers }
  }, [answers])

  const finishQuiz = useCallback(() => {
    const results = getResults()

    // Update stats
    dispatch({
      type: 'UPDATE_STATS',
      payload: {
        totalQuizzesTaken: state.stats.totalQuizzesTaken + 1,
        totalCorrect: state.stats.totalCorrect + results.correct,
        totalQuestions: state.stats.totalQuestions + results.total,
      }
    })

    // If passed, complete level and unlock next
    if (results.passed && level) {
      dispatch({ type: 'COMPLETE_LEVEL', payload: level.id })
      if (level.id < 100) {
        dispatch({ type: 'UNLOCK_LEVEL', payload: level.id + 1 })
      }
    }

    // Save to quiz history
    dispatch({
      type: 'SAVE_QUIZ_RESULT',
      payload: {
        levelId: level?.id,
        date: new Date().toISOString(),
        score: results.percentage,
        correct: results.correct,
        total: results.total,
      }
    })

    dispatch({ type: 'SET_MODE', payload: 'result' })
  }, [getResults, dispatch, state.stats, level])

  return {
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex],
    answers,
    showResult,
    totalQuestions: questions.length,
    generateQuestions,
    submitAnswer,
    nextQuestion,
    getResults,
    finishQuiz,
  }
}
```

**Step 2: Commit**

```bash
git add src/hooks/useQuiz.js
git commit -m "feat: add useQuiz hook"
```

---

### Task 5.2: QuizScreen 測驗主容器

**Files:**
- Create: `src/components/Quiz/QuizScreen.jsx`

**Step 1: 建立元件**

```jsx
// src/components/Quiz/QuizScreen.jsx
import { useEffect, useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { useQuiz } from '../../hooks/useQuiz'
import { ProgressBar } from '../shared'
import { ListeningQuiz } from './ListeningQuiz'
import { MeaningQuiz } from './MeaningQuiz'
import { WordQuiz } from './WordQuiz'
import { SpellingQuiz } from './SpellingQuiz'

export function QuizScreen() {
  const { dispatch } = useApp()
  const quiz = useQuiz()
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [showingFeedback, setShowingFeedback] = useState(false)

  useEffect(() => {
    quiz.generateQuestions()
  }, [])

  const handleAnswer = (answer) => {
    if (showingFeedback) return

    const isCorrect = quiz.submitAnswer(answer)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setShowingFeedback(true)

    setTimeout(() => {
      setFeedback(null)
      setShowingFeedback(false)

      if (quiz.currentIndex < quiz.totalQuestions - 1) {
        quiz.nextQuestion()
      } else {
        quiz.finishQuiz()
      }
    }, 1500)
  }

  const handleQuit = () => {
    dispatch({ type: 'SET_MODE', payload: 'home' })
  }

  const renderQuiz = () => {
    const question = quiz.currentQuestion
    if (!question) return null

    const props = {
      question,
      onAnswer: handleAnswer,
      feedback,
      disabled: showingFeedback,
    }

    switch (question.type) {
      case 'listening':
        return <ListeningQuiz {...props} />
      case 'meaning':
        return <MeaningQuiz {...props} />
      case 'word':
        return <WordQuiz {...props} />
      case 'spelling':
        return <SpellingQuiz {...props} />
      default:
        return null
    }
  }

  const progress = ((quiz.currentIndex + 1) / quiz.totalQuestions) * 100

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleQuit}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        >
          ✕
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {quiz.currentIndex + 1} / {quiz.totalQuestions}
        </span>
        <div className="w-10" />
      </div>

      {/* Progress */}
      <ProgressBar value={progress} size="sm" />

      {/* Quiz Content */}
      <div className="flex-1 flex flex-col justify-center py-8">
        {renderQuiz()}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Quiz/QuizScreen.jsx
git commit -m "feat: add QuizScreen component"
```

---

### Task 5.3: ListeningQuiz 聽力測驗

**Files:**
- Create: `src/components/Quiz/ListeningQuiz.jsx`

**Step 1: 建立元件**

```jsx
// src/components/Quiz/ListeningQuiz.jsx
import { useEffect } from 'react'
import { useSpeech } from '../../hooks/useSpeech'
import { Card } from '../shared'

export function ListeningQuiz({ question, onAnswer, feedback, disabled }) {
  const { speak, isSpeaking } = useSpeech()

  useEffect(() => {
    // 自動播放發音
    speak(question.word.word)
  }, [question])

  const handleSpeak = () => {
    speak(question.word.word)
  }

  const getOptionStyle = (option) => {
    if (!feedback) return ''
    if (option === question.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900 border-green-500 correct-pulse'
    }
    if (feedback === 'wrong') {
      return 'bg-red-100 dark:bg-red-900 border-red-500 shake'
    }
    return ''
  }

  return (
    <div className="space-y-6">
      {/* Speaker Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className="p-8 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          <span className="text-5xl">{isSpeaking ? '🔊' : '🔈'}</span>
        </button>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400">
        聽發音，選擇正確的意思
      </p>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <Card
            key={idx}
            onClick={() => !disabled && onAnswer(option)}
            className={`p-4 border-2 border-transparent cursor-pointer hover:border-blue-300 ${getOptionStyle(option)}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-gray-800 dark:text-gray-200">{option}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Quiz/ListeningQuiz.jsx
git commit -m "feat: add ListeningQuiz component"
```

---

### Task 5.4: MeaningQuiz 字義測驗

**Files:**
- Create: `src/components/Quiz/MeaningQuiz.jsx`

**Step 1: 建立元件**

```jsx
// src/components/Quiz/MeaningQuiz.jsx
import { Card } from '../shared'

export function MeaningQuiz({ question, onAnswer, feedback, disabled }) {
  const getOptionStyle = (option) => {
    if (!feedback) return ''
    if (option === question.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900 border-green-500 correct-pulse'
    }
    if (feedback === 'wrong') {
      return 'bg-red-100 dark:bg-red-900 border-red-500 shake'
    }
    return ''
  }

  return (
    <div className="space-y-6">
      {/* Word Display */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {question.word.word}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {question.word.phonetic}
        </p>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400">
        選擇正確的中文意思
      </p>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <Card
            key={idx}
            onClick={() => !disabled && onAnswer(option)}
            className={`p-4 border-2 border-transparent cursor-pointer hover:border-blue-300 ${getOptionStyle(option)}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-gray-800 dark:text-gray-200">{option}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Quiz/MeaningQuiz.jsx
git commit -m "feat: add MeaningQuiz component"
```

---

### Task 5.5: WordQuiz 認字測驗

**Files:**
- Create: `src/components/Quiz/WordQuiz.jsx`

**Step 1: 建立元件**

```jsx
// src/components/Quiz/WordQuiz.jsx
import { Card } from '../shared'

export function WordQuiz({ question, onAnswer, feedback, disabled }) {
  const getOptionStyle = (option) => {
    if (!feedback) return ''
    if (option === question.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900 border-green-500 correct-pulse'
    }
    if (feedback === 'wrong') {
      return 'bg-red-100 dark:bg-red-900 border-red-500 shake'
    }
    return ''
  }

  return (
    <div className="space-y-6">
      {/* Meaning Display */}
      <div className="text-center">
        <p className="text-sm text-blue-500 mb-2">{question.word.partOfSpeech}</p>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {question.word.meaning}
        </h2>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400">
        選擇正確的英文單字
      </p>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <Card
            key={idx}
            onClick={() => !disabled && onAnswer(option)}
            className={`p-4 border-2 border-transparent cursor-pointer hover:border-blue-300 ${getOptionStyle(option)}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">{option}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Quiz/WordQuiz.jsx
git commit -m "feat: add WordQuiz component"
```

---

### Task 5.6: SpellingQuiz 拼寫測驗

**Files:**
- Create: `src/components/Quiz/SpellingQuiz.jsx`

**Step 1: 建立元件**

```jsx
// src/components/Quiz/SpellingQuiz.jsx
import { useState, useEffect, useRef } from 'react'
import { useSpeech } from '../../hooks/useSpeech'
import { Button, Card } from '../shared'

export function SpellingQuiz({ question, onAnswer, feedback, disabled }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const { speak, isSpeaking } = useSpeech()

  useEffect(() => {
    speak(question.word.word)
    inputRef.current?.focus()
  }, [question])

  useEffect(() => {
    setInput('')
  }, [question])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!disabled && input.trim()) {
      onAnswer(input.trim())
    }
  }

  const handleSpeak = () => {
    speak(question.word.word)
  }

  const getInputStyle = () => {
    if (!feedback) return 'border-gray-300 dark:border-gray-600'
    if (feedback === 'correct') return 'border-green-500 bg-green-50 dark:bg-green-900'
    return 'border-red-500 bg-red-50 dark:bg-red-900'
  }

  return (
    <div className="space-y-6">
      {/* Speaker + Meaning */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className="p-6 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          <span className="text-4xl">{isSpeaking ? '🔊' : '🔈'}</span>
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {question.word.partOfSpeech}
          </p>
          <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
            {question.word.meaning}
          </p>
        </div>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400">
        聽發音，拼寫出正確的英文單字
      </p>

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <Card className="p-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder="輸入英文單字..."
            className={`w-full text-center text-2xl font-medium p-4 rounded-xl border-2 bg-transparent outline-none focus:border-blue-500 ${getInputStyle()}`}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {feedback === 'wrong' && (
            <p className="text-center mt-3 text-red-500">
              正確答案: <span className="font-bold">{question.correctAnswer}</span>
            </p>
          )}
        </Card>

        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          className="w-full mt-4"
          size="lg"
        >
          確認
        </Button>
      </form>
    </div>
  )
}
```

**Step 2: 建立 Quiz/index.js 匯出**

```javascript
// src/components/Quiz/index.js
export { QuizScreen } from './QuizScreen'
export { ListeningQuiz } from './ListeningQuiz'
export { MeaningQuiz } from './MeaningQuiz'
export { WordQuiz } from './WordQuiz'
export { SpellingQuiz } from './SpellingQuiz'
```

**Step 3: Commit**

```bash
git add src/components/Quiz/
git commit -m "feat: add SpellingQuiz component and Quiz exports"
```

---

### Task 5.7: ResultScreen 結果頁

**Files:**
- Create: `src/components/ResultScreen.jsx`

**Step 1: 建立元件**

```jsx
// src/components/ResultScreen.jsx
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
    dispatch({ type: 'SET_CURRENT_LEVEL', payload: level.id + 1 })
    dispatch({ type: 'SET_MODE', payload: 'learn' })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen flex flex-col items-center justify-center">
      {/* Result Icon */}
      <div className="text-6xl mb-4">
        {passed ? '🎉' : '💪'}
      </div>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {passed ? '測驗完成！' : '再接再厲！'}
      </h1>

      {/* Score Circle */}
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
              className={percentage >= 80 ? 'text-green-500' : percentage >= 60 ? 'text-yellow-500' : 'text-red-500'}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {percentage}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {correct}/{total}
            </span>
          </div>
        </div>
      </Card>

      {/* Stars */}
      <div className="text-3xl mb-2">
        {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-2">
        {stars === 3 ? '表現優異！' : stars === 2 ? '做得不錯！' : stars === 1 ? '繼續加油！' : '需要多練習'}
      </p>

      {nextLevelUnlocked && (
        <p className="text-green-500 font-medium mb-6">
          🔓 已解鎖關卡 {level.id + 1}
        </p>
      )}

      {/* Buttons */}
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
```

**Step 2: Commit**

```bash
git add src/components/ResultScreen.jsx
git commit -m "feat: add ResultScreen component"
```

---

## Phase 6: 驗證與測試

### Task 6.1: 啟動開發伺服器驗證

**Step 1: 安裝依賴**

```bash
npm install
```

**Step 2: 啟動開發伺服器**

```bash
npm run dev
```

**Step 3: 瀏覽器手動測試**

1. 訪問 http://localhost:5173
2. 驗證首頁顯示正常
3. 點擊關卡進入學習頁
4. 翻閱單字卡，測試發音
5. 完成學習後進行測驗
6. 驗證四種測驗類型
7. 完成測驗查看結果
8. 驗證關卡解鎖機制
9. 測試設定頁功能
10. 測試深色模式

---

## 執行摘要

| Phase | 任務數 | 主要產出 |
|-------|--------|----------|
| 1 | 21 | 20 個單字資料檔 + index.js |
| 2 | 6 | 6 個共用元件 |
| 3 | 1 | AppContext 擴充 |
| 4 | 4 | App, Home, Level, Settings |
| 5 | 7 | Quiz 系統 + Result |
| 6 | 1 | 驗證測試 |

**總計: 40 個任務**
