import { useEffect } from 'react'
import { useSpeech } from '../../hooks/useSpeech'
import { Card } from '../shared'

export function ListeningQuiz({ question, onAnswer, feedback, disabled }) {
  const { speak, isSpeaking } = useSpeech()

  useEffect(() => {
    speak(question.word.word)
  }, [question, speak])

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
      <div className="flex justify-center">
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className="p-8 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          <span className="text-5xl">{isSpeaking ? '🔊' : '🔈'}</span>
        </button>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400">聽發音，選擇正確的意思</p>

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
