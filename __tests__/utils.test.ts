import { daysUntil, monthlyEquiv, totalMonthly, fmt } from '@/lib/utils'
import { Subscription } from '@/types/subscription'

// ── daysUntil ──────────────────────────────────────────────────────────────
describe('daysUntil', () => {
  const todayISO = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  it('bugün için 0 döner', () => {
    expect(daysUntil(todayISO())).toBe(0)
  })

  it('geçmiş tarih için negatif döner', () => {
    expect(daysUntil('2020-01-01')).toBeLessThan(0)
  })

  it('gelecek tarih için pozitif döner', () => {
    expect(daysUntil('2099-12-31')).toBeGreaterThan(0)
  })

  it('timezone farkından etkilenmez (yerel gece yarısı kullanılır)', () => {
    // UTC+3 gibi offset'lerde new Date(isoStr) ile oluşturulan tarih
    // bir önceki gece yarısına düşebilir — bu testle yakalanır.
    const result = daysUntil(todayISO())
    expect(result).toBe(0) // asla -1 olmamalı
  })
})

// ── monthlyEquiv ───────────────────────────────────────────────────────────
describe('monthlyEquiv', () => {
  it('aylık fiyatı aynen döner', () => {
    expect(monthlyEquiv(100, 'monthly')).toBe(100)
  })

  it('yıllık fiyatı 12\'ye böler', () => {
    expect(monthlyEquiv(1200, 'yearly')).toBeCloseTo(100)
  })

  it('haftalık fiyatı 4.33 ile çarpar', () => {
    expect(monthlyEquiv(100, 'weekly')).toBeCloseTo(433)
  })
})

// ── totalMonthly ───────────────────────────────────────────────────────────
describe('totalMonthly', () => {
  const subs: Subscription[] = [
    { id: 1, name: 'A', price: 100,  cycle: 'monthly', date: '2026-04-01', icon: 'ai' },
    { id: 2, name: 'B', price: 1200, cycle: 'yearly',  date: '2026-04-01', icon: 'productivity'   },
    { id: 3, name: 'C', price: 50,   cycle: 'weekly',  date: '2026-04-01', icon: 'music'   },
  ]

  it('tüm dönemleri aylık eşdeğere çevirip toplar', () => {
    // 100 + (1200/12) + (50*4.33) = 100 + 100 + 216.5 = 416.5
    expect(totalMonthly(subs)).toBeCloseTo(416.5)
  })

  it('boş array için 0 döner', () => {
    expect(totalMonthly([])).toBe(0)
  })
})

// ── fmt ────────────────────────────────────────────────────────────────────
describe('fmt', () => {
  it('tam sayıyı formatlar', () => {
    expect(fmt(1234)).toBe('1.234') // tr-TR binlik ayracı nokta
  })

  it('ondalığı keser', () => {
    expect(fmt(99.9)).toBe('100')
  })

  it('sıfırı formatlar', () => {
    expect(fmt(0)).toBe('0')
  })
})
