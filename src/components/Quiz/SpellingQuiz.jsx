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
  }, [question, speak])

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
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className="p-6 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          <span className="text-4xl">{isSpeaking ? '🔊' : '🔈'}</span>
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{question.word.partOfSpeech}</p>
          <p className="text-xl font-medium text-gray-800 dark:text-gray-200">{question.word.meaning}</p>
        </div>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400">聽發音，拼寫出正確的英文單字</p>

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

        <Button type="submit" disabled={disabled || !input.trim()} className="w-full mt-4" size="lg">
          確認
        </Button>
      </form>
    </div>
  )
}
