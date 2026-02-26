import { useCallback, useRef } from 'react'

export function useFeedbackSound() {
  const contextRef = useRef(null)

  const ensureContext = useCallback(async () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null

    if (!contextRef.current) {
      contextRef.current = new AudioCtx()
    }

    if (contextRef.current.state === 'suspended') {
      await contextRef.current.resume()
    }

    return contextRef.current
  }, [])

  const playTone = useCallback(async ({ frequency, duration, type = 'sine', volume = 0.08, delay = 0 }) => {
    const context = await ensureContext()
    if (!context) return

    const now = context.currentTime + delay
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, now)

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.start(now)
    oscillator.stop(now + duration + 0.02)
  }, [ensureContext])

  const playCorrect = useCallback(() => {
    playTone({ frequency: 880, duration: 0.1, type: 'sine', volume: 0.07, delay: 0 })
    playTone({ frequency: 1175, duration: 0.12, type: 'sine', volume: 0.07, delay: 0.11 })
  }, [playTone])

  const playWrong = useCallback(() => {
    playTone({ frequency: 320, duration: 0.12, type: 'sawtooth', volume: 0.06, delay: 0 })
    playTone({ frequency: 220, duration: 0.16, type: 'sawtooth', volume: 0.06, delay: 0.1 })
  }, [playTone])

  return {
    playCorrect,
    playWrong,
    isSupported: typeof window !== 'undefined' && !!(window.AudioContext || window.webkitAudioContext),
  }
}
