import { Subscription, ICON_META, CYCLE_LABELS } from '@/types/subscription'
import { daysUntil, monthlyEquiv, fmt, fmtDate } from '@/lib/utils'
import { PROGRESS_DANGER_PCT, PROGRESS_WARN_PCT } from '@/lib/constants'
import { Badge } from './Badge'

interface Props {
  sub:       Subscription
  editable?: boolean
  onEdit?:   (s: Subscription) => void
  onDelete?: (id: number) => void
}

function progressColor(pct: number, hex: string): string {
  if (pct > PROGRESS_DANGER_PCT) return '#e03030'
  if (pct > PROGRESS_WARN_PCT)   return '#cc7700'
  return hex
}

export function SubCard({ sub, editable, onEdit, onDelete }: Props) {
  const d    = daysUntil(sub.date)
  const meta = ICON_META[sub.icon]
  const pct  = Math.max(0, Math.min(100, 100 - Math.max(0, d) / 30 * 100))

  return (
    <article className="card" aria-label={`${sub.name} aboneliği`}>
      <div className="srow">
        {/* İkon */}
        <div
          className="sico"
          style={{ background: meta.bg, color: meta.text }}
          aria-hidden="true"
        >
          {meta.emoji}
        </div>

        {/* Bilgi */}
        <div className="sinf">
          <div className="sname">{sub.name}</div>
          <div className="smeta">{CYCLE_LABELS[sub.cycle]} · {fmtDate(sub.date)}</div>
          <Badge date={sub.date} />
        </div>

        {/* Fiyat + aksiyonlar */}
        <div className="sright" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div>
            <div className="sprice">
              ₺{fmt(sub.price)}
              {sub.cycle === 'yearly' && (
                <span className="year-note"> (₺{fmt(monthlyEquiv(sub.price, sub.cycle))}/ay)</span>
              )}
            </div>
            <div className="scycle">{d >= 0 ? `${d} gün` : 'geçti'}</div>
          </div>

          {editable && (
            <>
              <button
                className="ibtn"
                onClick={() => onEdit?.(sub)}
                aria-label={`${sub.name} düzenle`}
              >✏️</button>
              <button
                className="ibtn del"
                onClick={() => onDelete?.(sub.id)}
                aria-label={`${sub.name} sil`}
              >🗑</button>
            </>
          )}
        </div>
      </div>

      <div
        className="prog"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="prog-fill"
          style={{ width: `${pct}%`, background: progressColor(pct, meta.hex) }}
        />
      </div>
    </article>
  )
}
