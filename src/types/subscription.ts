export type Cycle = 'monthly' | 'yearly' | 'weekly'

// Kullanıcının seçtiği ikon — renk buradan otomatik türetilir
export type IconKey =
  | 'streaming'   // 🎬
  | 'music'       // 🎵
  | 'gaming'      // 🎮
  | 'productivity'// 💼
  | 'ai'          // 🤖
  | 'cloud'       // ☁️
  | 'fitness'     // 💪
  | 'news'        // 📰
  | 'education'   // 📚
  | 'shopping'    // 🛍️
  | 'finance'     // 💳
  | 'other'       // 📦

export interface Subscription {
  id:    number
  name:  string
  price: number
  cycle: Cycle
  date:  string   // ISO: "2026-04-05"
  icon:  IconKey  // renk bu fielddan otomatik gelir
}

// Her ikon → emoji + renk paleti (otomatik eşleşme)
export const ICON_META: Record<IconKey, {
  emoji: string
  label: string
  bg:    string
  text:  string
  hex:   string
}> = {
  streaming:    { emoji: '🎬', label: 'Yayın',       bg: 'rgba(249,115,22,.13)',  text: '#ea580c', hex: '#f97316' },
  music:        { emoji: '🎵', label: 'Müzik',       bg: 'rgba(20,184,166,.13)',  text: '#0d9488', hex: '#14b8a6' },
  gaming:       { emoji: '🎮', label: 'Oyun',        bg: 'rgba(91,76,245,.13)',   text: '#5b4cf5', hex: '#5b4cf5' },
  productivity: { emoji: '💼', label: 'İş',          bg: 'rgba(59,130,246,.13)',  text: '#2563eb', hex: '#3b82f6' },
  ai:           { emoji: '🤖', label: 'Yapay Zeka',  bg: 'rgba(168,85,247,.13)',  text: '#9333ea', hex: '#a855f7' },
  cloud:        { emoji: '☁️', label: 'Bulut',       bg: 'rgba(14,165,233,.13)',  text: '#0284c7', hex: '#0ea5e9' },
  fitness:      { emoji: '💪', label: 'Fitness',     bg: 'rgba(34,197,94,.13)',   text: '#16a34a', hex: '#22c55e' },
  news:         { emoji: '📰', label: 'Haber',       bg: 'rgba(100,116,139,.13)', text: '#475569', hex: '#64748b' },
  education:    { emoji: '📚', label: 'Eğitim',      bg: 'rgba(245,158,11,.13)',  text: '#d97706', hex: '#f59e0b' },
  shopping:     { emoji: '🛍️', label: 'Alışveriş',  bg: 'rgba(236,72,153,.13)',  text: '#db2777', hex: '#ec4899' },
  finance:      { emoji: '💳', label: 'Finans',      bg: 'rgba(16,185,129,.13)',  text: '#059669', hex: '#10b981' },
  other:        { emoji: '📦', label: 'Diğer',       bg: 'rgba(156,163,175,.13)', text: '#6b7280', hex: '#9ca3af' },
}

export const CYCLE_LABELS: Record<Cycle, string> = {
  monthly: 'Aylık', yearly: 'Yıllık', weekly: 'Haftalık',
}


