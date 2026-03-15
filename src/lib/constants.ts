// ── Bildirim eşikleri (gün cinsinden) ─────────────────────────────────────
export const NOTIFICATION_THRESHOLDS = [0, 1, 3] as const
export type NotificationThreshold = (typeof NOTIFICATION_THRESHOLDS)[number]

// ── Uyarı renk eşikleri ────────────────────────────────────────────────────
export const ALERT_DANGER_DAYS = 3   // kırmızı badge
export const ALERT_WARN_DAYS   = 7   // sarı badge

// ── İlerleme çubuğu renk eşikleri (%) ─────────────────────────────────────
export const PROGRESS_DANGER_PCT = 80
export const PROGRESS_WARN_PCT   = 50

// ── Dönem katsayıları ──────────────────────────────────────────────────────
export const WEEKS_PER_MONTH   = 4.33
export const MONTHS_PER_YEAR   = 12

// ── localStorage / sessionStorage key'leri ────────────────────────────────
export const STORAGE_KEY          = 'subtrack_v1'
export const THEME_STORAGE_KEY    = 'subtrack_theme'
export const NOTIF_DISMISSED_KEY  = 'notif_dismissed'

// ── Grafik ────────────────────────────────────────────────────────────────
export const CHART_MONTHS = 6   // kaç aylık geçmiş gösterilsin

// ── Panelde gösterilecek max kart sayısı ──────────────────────────────────
export const DASHBOARD_UPCOMING_LIMIT = 5

// ── Yenileme tahmini için aylık pencere (gün) ──────────────────────────────
export const RENEWAL_WINDOW_DAYS = 31
