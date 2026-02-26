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
    if (!level) {
      setQuestions([])
      setCurrentIndex(0)
      setAnswers([])
      setShowResult(false)
      return
    }

    const words = level.words
    const quizTypes = ['listening', 'meaning', 'word', 'spelling']
    const shuffledWords = shuffleArray([...words]).slice(0, 10)

    const allWords = allLevels.flatMap((l) => l.words)

    const newQuestions = shuffledWords.map((word, idx) => {
      const type = quizTypes[idx % quizTypes.length]

      if (type === 'listening' || type === 'meaning') {
        const allMeanings = allWords.map((w) => w.meaning)
        const options = generateOptions(word.meaning, allMeanings, 4)
        return { type, word, options, correctAnswer: word.meaning }
      }

      if (type === 'word') {
        const allWordTexts = allWords.map((w) => w.word)
        const options = generateOptions(word.word, allWordTexts, 4)
        return { type, word, options, correctAnswer: word.word }
      }

      return { type, word, options: null, correctAnswer: word.word }
    })

    setQuestions(shuffleArray(newQuestions))
    setCurrentIndex(0)
    setAnswers([])
    setShowResult(false)
  }, [level])

  const submitAnswer = useCallback(
    (answer) => {
      const question = questions[currentIndex]
      if (!question) return false

      const isCorrect =
        answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()

      const newAnswer = {
        questionIndex: currentIndex,
        question,
        userAnswer: answer,
        isCorrect,
      }

      setAnswers((prev) => [...prev, newAnswer])

      return isCorrect
    },
    [questions, currentIndex],
  )

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setShowResult(true)
    }
  }, [currentIndex, questions.length])

  const getResults = useCallback(() => {
    const correct = answers.filter((a) => a.isCorrect).length
    const total = answers.length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
    const passed = percentage >= 80

    return { correct, total, percentage, passed, answers }
  }, [answers])

  const finishQuiz = useCallback(() => {
    const results = getResults()

    dispatch({
      type: 'UPDATE_STATS',
      payload: {
        totalQuizzesTaken: state.stats.totalQuizzesTaken + 1,
        totalCorrect: state.stats.totalCorrect + results.correct,
        totalQuestions: state.stats.totalQuestions + results.total,
      },
    })

    if (results.passed && level) {
      dispatch({ type: 'COMPLETE_LEVEL', payload: level.id })
      if (level.id < 100) {
        dispatch({ type: 'UNLOCK_LEVEL', payload: level.id + 1 })
      }
    }

    dispatch({
      type: 'SAVE_QUIZ_RESULT',
      payload: {
        levelId: level?.id,
        date: new Date().toISOString(),
        score: results.percentage,
        correct: results.correct,
        total: results.total,
      },
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
