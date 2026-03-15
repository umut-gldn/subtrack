'use client'
import { useState } from 'react'
import { Subscription, ICON_META, CYCLE_LABELS } from '@/types/subscription'
import { daysUntil, fmt } from '@/lib/utils'

interface Props { subs: Subscription[]; dark: boolean }

export function Calendar({ subs, dark }: Props) {
  const now = new Date()
  const [calY, setCalY] = useState(now.getFullYear())
  const [calM, setCalM] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const prevM = () => { if (calM === 0) { setCalY(y => y - 1); setCalM(11) } else setCalM(m => m - 1); setSelectedDay(null) }
  const nextM = () => { if (calM === 11) { setCalY(y => y + 1); setCalM(0) }  else setCalM(m => m + 1); setSelectedDay(null) }

  const title = new Date(calY, calM).toLocaleString('tr-TR', { month: 'long', year: 'numeric' })

  // build renewal map for this month — timezone-safe parse
  const rd: Record<number, Subscription[]> = {}
  subs.forEach(s => {
    const [y, m, d] = s.date.split('-').map(Number)
    const renewDate = new Date(y, m - 1, d)
    if (renewDate.getFullYear() === calY && renewDate.getMonth() === calM) {
      const day = renewDate.getDate()
      if (!rd[day]) rd[day] = []
      rd[day].push(s)
    }
  })

  let offset = new Date(calY, calM, 1).getDay() - 1
  if (offset < 0) offset = 6
  const daysInMonth = new Date(calY, calM + 1, 0).getDate()

  const dayEvents = selectedDay ? (rd[selectedDay] ?? []) : []
  const t2 = dark ? '#8888a8' : '#666677'

  return (
    <>
      <div className="card">
        <div className="sh" style={{ marginBottom: 12 }}>
          <button className="btn" onClick={prevM} style={{ padding: '5px 11px' }}>‹</button>
          <span className="st">{title.charAt(0).toUpperCase() + title.slice(1)}</span>
          <button className="btn" onClick={nextM} style={{ padding: '5px 11px' }}>›</button>
        </div>

        {/* Day headers */}
        <div className="cal-grid">
          {['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].map(h => (
            <div key={h} className="cal-hd">{h}</div>
          ))}
        </div>

        <div style={{ height: 5 }} />

        {/* Day cells */}
        <div className="cal-grid">
          {Array.from({ length: offset }, (_, i) => <div key={`e${i}`} className="cal-d empty" />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const isToday = day === now.getDate() && calM === now.getMonth() && calY === now.getFullYear()
            const hasr = !!rd[day]
            let cls = 'cal-d'
            if (isToday) cls += ' today'
            else if (hasr) cls += ' hasr'
            return (
              <div key={day} className={cls} onClick={() => setSelectedDay(selectedDay === day ? null : day)}>
                {day}
                {hasr && !isToday && <div className="cdot" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Day detail */}
      {selectedDay && dayEvents.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: t2, margin: '10px 0 7px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            {selectedDay} {new Date(calY, calM).toLocaleString('tr-TR', { month: 'long' })}
          </div>
          {dayEvents.map(s => {
            const meta = ICON_META[s.icon]
            return (
              <div key={s.id} className="card">
                <div className="srow">
                  <div className="sico" style={{ background: meta.bg, color: meta.text }}>{meta.emoji}</div>
                  <div className="sinf">
                    <div className="sname">{s.name}</div>
                    <div className="smeta">{CYCLE_LABELS[s.cycle]} · {daysUntil(s.date) > 0 ? `${daysUntil(s.date)} gün kaldı` : 'bugün!'}</div>
                  </div>
                  <div className="sright">
                    <div className="sprice">₺{fmt(s.price)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </>
  )
}
