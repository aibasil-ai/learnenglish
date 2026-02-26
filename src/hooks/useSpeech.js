import { useCallback, useRef, useEffect, useState } from 'react'
import { useApp } from '../contexts/AppContext'

export function useSpeech() {
  const { state } = useApp()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const utteranceRef = useRef(null)
  const hasPrimedRef = useRef(false)

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
      utterance.onend = finish
      utterance.onerror = finish

      // 手機瀏覽器常出現 voices 非同步載入或事件不觸發，因此要有 fallback
      if (synth.getVoices().length === 0) {
        voicesChangedHandler = () => {
          const newVoice = getVoice()
          if (newVoice) {
            utterance.voice = newVoice
            utterance.lang = newVoice.lang
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
