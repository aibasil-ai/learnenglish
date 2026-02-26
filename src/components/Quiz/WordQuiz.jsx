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
      <div className="text-center">
        <p className="text-sm text-blue-500 mb-2">{question.word.partOfSpeech}</p>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{question.word.meaning}</h2>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400">選擇正確的英文單字</p>

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
