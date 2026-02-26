import { useEffect, useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { useQuiz } from '../../hooks/useQuiz'
import { useFeedbackSound } from '../../hooks/useFeedbackSound'
import { ProgressBar } from '../shared'
import { ListeningQuiz } from './ListeningQuiz'
import { MeaningQuiz } from './MeaningQuiz'
import { WordQuiz } from './WordQuiz'
import { SpellingQuiz } from './SpellingQuiz'

export function QuizScreen() {
  const { dispatch } = useApp()
  const quiz = useQuiz()
  const { playCorrect, playWrong } = useFeedbackSound()
  const [feedback, setFeedback] = useState(null)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const { generateQuestions } = quiz

  useEffect(() => {
    generateQuestions()
  }, [generateQuestions])

  const handleAnswer = (answer) => {
    if (showingFeedback) return

    const isCorrect = quiz.submitAnswer(answer)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setShowingFeedback(true)
    if (isCorrect) playCorrect()
    else playWrong()

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

  const hasQuestions = quiz.totalQuestions > 0
  const progress = hasQuestions ? ((quiz.currentIndex + 1) / quiz.totalQuestions) * 100 : 0

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleQuit}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        >
          ✕
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {hasQuestions ? `${quiz.currentIndex + 1} / ${quiz.totalQuestions}` : '載入中...'}
        </span>
        <div className="w-10" />
      </div>

      <ProgressBar value={progress} size="sm" />

      <div className="flex-1 flex flex-col justify-center py-8">{renderQuiz()}</div>
    </div>
  )
}
