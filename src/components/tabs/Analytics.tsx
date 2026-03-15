'use client'
import { useEffect, useRef } from 'react'
import {
  Chart, BarElement, CategoryScale, LinearScale,
  Tooltip, BarController,
} from 'chart.js'
import { Subscription, ICON_META, CYCLE_LABELS } from '@/types/subscription'
import { monthlyEquiv, totalMonthly, fmt } from '@/lib/utils'
import { CHART_MONTHS } from '@/lib/constants'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

interface Props { subs: Subscription[]; dark: boolean }

/**
 * Verilen ay/yıl için, o ay yenilenecek aboneliklerin toplam maliyetini döner.
 * Gerçek yenileme tarihleri baz alınır — Math.random() yok.
 */
function monthlySpend(subs: Subscription[], year: number, month: number): number {
  return subs.reduce((sum, s) => {
    const renewDate = new Date(s.date)

    if (s.cycle === 'monthly') {
      // Her ay yenilenen: sadece gün sayısı önemli değil, her ay bu maliyet var
      return sum + s.price
    }

    if (s.cycle === 'yearly') {
      // Yılda bir yenilenen: o ay yenileniyor mu?
      const sameMonth = renewDate.getMonth() === month && renewDate.getFullYear() <= year
      return sum + (sameMonth ? s.price : 0)
    }

    if (s.cycle === 'weekly') {
      // Haftalık: aylık eşdeğer
      return sum + monthlyEquiv(s.price, s.cycle)
    }

    return sum
  }, 0)
}

export function Analytics({ subs, dark }: Props) {
  const chartRef  = useRef<HTMLCanvasElement>(null)
  const chartInst = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const now = new Date()
    const labels: string[] = []
    const data:   number[] = []

    for (let i = CHART_MONTHS - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      labels.push(d.toLocaleString('tr-TR', { month: 'short' }))
      data.push(Math.round(monthlySpend(subs, d.getFullYear(), d.getMonth())))
    }

    const tc = dark ? '#8888a8' : '#666677'
    const gc = dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'
    const ac = dark ? '#7b6fff' : '#5b4cf5'

    chartInst.current?.destroy()
    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor:     ac + 'bb',
          hoverBackgroundColor: ac,
          borderRadius:  8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: v => ` ₺${fmt(v.raw as number)}` },
            backgroundColor: dark ? '#1e1e28' : '#fff',
            titleColor:      dark ? '#f0f0f8' : '#0d0d14',
            bodyColor:       tc,
            borderColor:     dark ? '#333345' : '#c8c8dc',
            borderWidth: 1, padding: 10, cornerRadius: 8,
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: tc, font: { size: 11 } } },
          y: {
            grid:   { color: gc },
            border: { display: false },
            ticks:  { color: tc, font: { size: 11 }, callback: v => '₺' + v },
          },
        },
      },
    })

    return () => { chartInst.current?.destroy() }
  }, [subs, dark])

  const maxPrice = Math.max(...subs.map(s => s.price), 1)
  const sorted   = [...subs].sort((a, b) => b.price - a.price)

  return (
    <>
      <div className="card" style={{ marginBottom: 8 }}>
        <div className="st" style={{ marginBottom: 3 }}>Aylık Harcama Trendi</div>
        <div style={{ fontSize: 11, color: dark ? '#55556a' : '#888899', marginBottom: 12 }}>
          Son {CHART_MONTHS} ay — gerçek yenileme tarihlerine göre
        </div>
        <div className="chart-wrap">
          <canvas ref={chartRef} aria-label="Aylık harcama grafiği" role="img" />
        </div>
      </div>

      <div className="card">
        <div className="st" style={{ marginBottom: 12 }}>Abonelik Bazlı</div>
        {sorted.map(s => {
          const meta = ICON_META[s.icon]
          const pct = Math.round(s.price / maxPrice * 100)
          return (
            <div key={s.id} className="bk-row">
              <div style={{ fontSize: 13, width: 22, textAlign: 'center', flexShrink: 0 }}>
                {meta.emoji}
              </div>
              <div style={{ minWidth: 90, maxWidth: 90 }}>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: dark ? '#f0f0f8' : '#0d0d14',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 10, color: dark ? '#55556a' : '#888899' }}>
                  {CYCLE_LABELS[s.cycle]}
                </div>
              </div>
              <div className="bk-bar-wrap">
                <div className="bk-bar" style={{ width: `${pct}%`, background: meta.hex }} />
              </div>
              <div style={{
                minWidth: 60, textAlign: 'right',
                fontSize: 12, fontWeight: 700,
                color: dark ? '#f0f0f8' : '#0d0d14',
              }}>
                ₺{fmt(s.price)}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
