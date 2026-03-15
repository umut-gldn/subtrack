import { Subscription, Cycle } from '@/types/subscription'
import { WEEKS_PER_MONTH, MONTHS_PER_YEAR } from './constants'

/**
 * Verilen ISO tarih stringine kaç gün kaldığını döner.
 * Timezone-safe: her iki tarafı da yerel gece yarısına normalize eder,
 * böylece UTC offset farkından kaynaklanan ±1 gün hatası olmaz.
 */
export function daysUntil(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  const target = new Date(y, m - 1, d)          // yerel gece yarısı
  const today  = new Date()
  today.setHours(0, 0, 0, 0)                    // yerel gece yarısı
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000)
}

/**
 * Herhangi bir dönemdeki fiyatı aylık eşdeğere çevirir.
 */
export function monthlyEquiv(price: number, cycle: Cycle): number {
  switch (cycle) {
    case 'yearly': return price / MONTHS_PER_YEAR
    case 'weekly': return price * WEEKS_PER_MONTH
    case 'monthly': return price
  }
}

/**
 * Aboneliklerin toplam aylık maliyetini hesaplar.
 */
export function totalMonthly(subs: Subscription[]): number {
  return subs.reduce((sum, s) => sum + monthlyEquiv(s.price, s.cycle), 0)
}

/**
 * Sayıyı Türkçe locale ile formatlar (₺ işareti hariç, sadece rakam).
 */
export function fmt(n: number): string {
  return Number(n).toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/**
 * ISO tarih stringini kısa Türkçe formata çevirir ("5 Nis" gibi).
 */
export function fmtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
  })
}

/**
 * ISO tarih stringini uzun Türkçe formata çevirir ("5 Nisan" gibi).
 */
export function fmtDateLong(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
  })
}
