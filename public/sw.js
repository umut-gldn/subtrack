// subtrack — Service Worker
// JSDoc ile tip güvenliği sağlanır (TS olmadan).

/** @typedef {{ id: number, name: string, price: number, cycle: string, date: string }} Sub */

// constants (sw.js bundle dışı olduğu için burada tekrar tanımlanır)
const NOTIFICATION_THRESHOLDS = [0, 1, 3]

self.addEventListener('install',  () => self.skipWaiting())
self.addEventListener('activate', e  => e.waitUntil(self.clients.claim()))

/** @param {{ type: string, subs: Sub[] }} data */
self.addEventListener('message', e => {
  if (e.data?.type === 'CHECK_RENEWALS') {
    checkAndNotify(e.data.subs ?? [])
  }
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        const existing = clients.find(c => c.url.startsWith(self.location.origin))
        return existing ? existing.focus() : self.clients.openWindow('/')
      })
  )
})

/** @param {Sub[]} subs */
function checkAndNotify(subs) {
  const today = localMidnight()

  subs.forEach(sub => {
    const renewDate  = parseLocalDate(sub.date)
    const daysLeft   = Math.ceil((renewDate - today) / 86_400_000)

    if (!NOTIFICATION_THRESHOLDS.includes(daysLeft)) return

    const title = daysLeft === 0
      ? `⚡ ${sub.name} bugün yenileniyor!`
      : `🔔 ${sub.name} ${daysLeft} gün sonra yenileniyor`

    const body = daysLeft === 0
      ? `₺${fmt(sub.price)} hesabınızdan çekilecek.`
      : `${fmtDate(sub.date)} tarihinde ₺${fmt(sub.price)} çekilecek.`

    // tag: aynı bildirim bugün zaten gösterildiyse replace eder
    const tag = `subtrack-${sub.id}-d${daysLeft}-${isoToday()}`

    self.registration.showNotification(title, {
      body,
      icon:    '/icon-192.png',
      badge:   '/icon-192.png',
      tag,
      renotify: false,
      data:    { subId: sub.id },
      actions: [
        { action: 'open',    title: 'Görüntüle' },
        { action: 'dismiss', title: 'Kapat'     },
      ],
    })
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Yerel gece yarısı Date objesi — timezone-safe */
function localMidnight() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * "YYYY-MM-DD" → yerel gece yarısı Date (new Date(str) UTC'ye parse eder, bu yapmaz)
 * @param {string} dateStr
 */
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** @param {number} n */
function fmt(n) {
  return Number(n).toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/** @param {string} dateStr */
function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long',
  })
}

function isoToday() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
