import { useCallback, useRef, useEffect, useState } from 'react'
import { useApp } from '../contexts/AppContext'

export function useSpeech() {
  const { state } = useApp()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false)
    }
  }, [])

  const getVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices()

    // 優先使用的語音列表
    const preferredVoices = state.accentType === 'us'
      ? [
          'Google US English',
          'Microsoft Mark - English (United States)',
          'Microsoft David - English (United States)',
          'Samantha',
          'Alex',
          'en-US',
        ]
      : [
          'Google UK English Female',
          'Google UK English Male',
          'Microsoft Hazel - English (United Kingdom)',
          'Daniel',
          'en-GB',
        ]

    // 嘗試找到優先語音
    for (const preferred of preferredVoices) {
      const voice = voices.find(v =>
        v.name.includes(preferred) || v.lang.includes(preferred)
      )
      if (voice) return voice
    }

    // 回退到任何英文語音
    const langCode = state.accentType === 'us' ? 'en-US' : 'en-GB'
    const fallback = voices.find(v => v.lang === langCode) ||
                     voices.find(v => v.lang.startsWith('en'))

    return fallback || voices[0]
  }, [state.accentType])

  const speak = useCallback((text, options = {}) => {
    if (!isSupported || !text) return Promise.resolve()

    return new Promise((resolve) => {
      // 停止之前的發音
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // 設定語音
      const voice = getVoice()
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      } else {
        utterance.lang = state.accentType === 'us' ? 'en-US' : 'en-GB'
      }

      // 設定參數
      utterance.rate = options.rate || 0.9
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        resolve()
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        resolve()
      }

      // Chrome 需要延遲載入語音
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          const newVoice = getVoice()
          if (newVoice) {
            utterance.voice = newVoice
            utterance.lang = newVoice.lang
          }
          window.speechSynthesis.speak(utterance)
        }, { once: true })
      } else {
        window.speechSynthesis.speak(utterance)
      }
    })
  }, [isSupported, getVoice, state.accentType])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking, isSupported }
}
