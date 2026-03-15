'use client'
import { useState, useEffect } from 'react'
import { THEME_STORAGE_KEY } from '@/lib/constants'

export function useTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      const saved       = localStorage.getItem(THEME_STORAGE_KEY)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark      = saved ? saved === 'dark' : prefersDark
      setDark(isDark)
      document.body.classList.toggle('dark', isDark)
    } catch (err) {
      console.error('[subtrack] Tema yüklenemedi:', err)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.body.classList.toggle('dark', next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
    } catch (err) {
      console.error('[subtrack] Tema kaydedilemedi:', err)
    }
  }

  return { dark, toggle }
}
