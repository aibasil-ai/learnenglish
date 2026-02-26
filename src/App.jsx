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
