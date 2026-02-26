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
