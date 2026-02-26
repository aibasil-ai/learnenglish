import { useCallback, useRef, useEffect, useState } from 'react'
import { useApp } from '../contexts/AppContext'

export function useSpeech() {
  const { state } = useApp()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const utteranceRef = useRef(null)
  const hasPrimedRef = useRef(false)

  const normalizeLang = (lang = '') => lang.toLowerCase().replace('_', '-')

  const formatLang = (lang = '') => {
    const normalized = normalizeLang(lang)
    const [base, region] = normalized.split('-')
    if (!region) return normalized
    return `${base}-${region.toUpperCase()}`
  }

  useEffect(() => {
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') {
      setIsSupported(false)
    }
  }, [])

  useEffect(() => {
    if (!isSupported) return

    const synth = window.speechSynthesis

    // 觸發語音清單初始化，部分手機瀏覽器需要先呼叫一次
    synth.getVoices()

    // 手機常需要手勢後才允許語音輸出
    const primeOnGesture = () => {
      try {
        synth.resume()

        if (hasPrimedRef.current) return
        hasPrimedRef.current = true

        const warmup = new SpeechSynthesisUtterance(' ')
        warmup.volume = 0
        synth.speak(warmup)
        setTimeout(() => synth.cancel(), 80)
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('touchstart', primeOnGesture, { once: true, passive: true })
    window.addEventListener('click', primeOnGesture, { once: true, passive: true })

    return () => {
      window.removeEventListener('touchstart', primeOnGesture)
      window.removeEventListener('click', primeOnGesture)
    }
  }, [isSupported])

  const getVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length === 0) return null

    const targetLang = state.accentType === 'us' ? 'en-us' : 'en-gb'
    const oppositeLang = state.accentType === 'us' ? 'en-gb' : 'en-us'
    const positiveKeywords = state.accentType === 'us'
      ? ['united states', 'american', ' us ']
      : ['united kingdom', 'british', ' england', ' uk ']
    const negativeKeywords = state.accentType === 'us'
      ? ['united kingdom', 'british', ' england', ' uk ']
      : ['united states', 'american', ' us ']

    let bestVoice = null
    let bestScore = Number.NEGATIVE_INFINITY

    for (const voice of voices) {
      const lang = normalizeLang(voice.lang)
      const name = ` ${voice.name.toLowerCase()} `
      let score = 0

      if (lang === targetLang) score += 120
      else if (lang.startsWith('en-')) score += 40
      else if (lang.startsWith('en')) score += 25

      if (lang === oppositeLang) score -= 120

      for (const keyword of positiveKeywords) {
        if (name.includes(keyword)) score += 60
      }
      for (const keyword of negativeKeywords) {
        if (name.includes(keyword)) score -= 60
      }

      if (voice.default) score += 5

      if (score > bestScore) {
        bestScore = score
        bestVoice = voice
      }
    }

    // 沒有明確匹配時回傳 null，改由 utterance.lang 指示口音，避免強制綁到同一個 fallback voice
    if (!bestVoice) return null
    const bestLang = normalizeLang(bestVoice.lang)
    const keywordMatched = positiveKeywords.some((keyword) =>
      ` ${bestVoice.name.toLowerCase()} `.includes(keyword),
    )
    const isTarget = bestLang === targetLang || keywordMatched

    return isTarget ? bestVoice : null
  }, [state.accentType])

  const speak = useCallback((text, options = {}) => {
    if (!isSupported || !text) return Promise.resolve()

    return new Promise((resolve) => {
      const synth = window.speechSynthesis
      let hasSpoken = false
      let finished = false
      let fallbackTimer = null
      let voicesChangedHandler = null

      const cleanup = () => {
        if (fallbackTimer) clearTimeout(fallbackTimer)
        if (voicesChangedHandler) {
          synth.removeEventListener('voiceschanged', voicesChangedHandler)
        }
      }

      const finish = () => {
        if (finished) return
        finished = true
        cleanup()
        setIsSpeaking(false)
        resolve()
      }

      const speakOnce = () => {
        if (hasSpoken) return
        hasSpoken = true
        try {
          synth.resume()
          synth.speak(utterance)
        } catch (e) {
          finish()
        }
      }

      // 停止之前的發音
      synth.cancel()
      synth.resume()

      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // 設定語音
      const targetLang = state.accentType === 'us' ? 'en-US' : 'en-GB'
      const voice = getVoice()
      if (voice) {
        utterance.voice = voice
        utterance.lang = formatLang(voice.lang)
      } else {
        utterance.lang = targetLang
      }

      // 設定參數
      utterance.rate = options.rate || 0.9
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = finish
      utterance.onerror = finish

      // 手機瀏覽器常出現 voices 非同步載入或事件不觸發，因此要有 fallback
      if (synth.getVoices().length === 0) {
        voicesChangedHandler = () => {
          const newVoice = getVoice()
          if (newVoice) {
            utterance.voice = newVoice
            utterance.lang = formatLang(newVoice.lang)
          } else {
            utterance.lang = targetLang
          }
          speakOnce()
        }

        synth.addEventListener('voiceschanged', voicesChangedHandler, { once: true })

        fallbackTimer = setTimeout(() => {
          speakOnce()
        }, 350)
      } else {
        speakOnce()
      }
    })
  }, [isSupported, getVoice, state.accentType])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking, isSupported }
}
