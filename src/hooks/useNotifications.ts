'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Subscription } from '@/types/subscription'

export type NotifPermission = 'default' | 'granted' | 'denied' | 'unsupported'

function isSupported(): boolean {
  return typeof window !== 'undefined'
    && 'serviceWorker' in navigator
    && 'Notification' in window
}

async function sendSubsToSW(subs: Subscription[]): Promise<void> {
  const reg = await navigator.serviceWorker.ready
  reg.active?.postMessage({ type: 'CHECK_RENEWALS', subs })
}

export function useNotifications(subs: Subscription[]) {
  const [permission, setPermission] = useState<NotifPermission>('default')
  const [swReady, setSwReady]       = useState(false)
  // subsRef: SW'ye son gönderilen subs — gereksiz tekrar mesaj engeller
  const subsRef = useRef<string>('')

  // ── SW kayıt — sadece bir kez ───────────────────────────────────────────
  useEffect(() => {
    if (!isSupported()) { setPermission('unsupported'); return }

    setPermission(Notification.permission as NotifPermission)

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(() => setSwReady(true))
      .catch(err => console.error('[subtrack] SW register failed:', err))
  }, []) // boş dep — sadece mount'ta çalışır

  // ── Subs değişince SW'ye gönder — ama sadece gerçekten değiştiyse ───────
  useEffect(() => {
    if (!swReady || permission !== 'granted') return

    const serialized = JSON.stringify(subs)
    if (serialized === subsRef.current) return  // değişmediyse gönderme
    subsRef.current = serialized

    sendSubsToSW(subs).catch(err =>
      console.error('[subtrack] SW message failed:', err)
    )
  }, [swReady, permission, subs])

  // ── İzin iste ────────────────────────────────────────────────────────────
  const requestPermission = useCallback(async () => {
    if (!isSupported()) return

    const result = await Notification.requestPermission()
    setPermission(result as NotifPermission)

    if (result === 'granted') {
      await sendSubsToSW(subs)
    }
  }, [subs]) // subs değişirse yeni closure — ama requestPermission nadiren çağrılır

  return { permission, requestPermission }
}
