import { Subscription } from '@/types/subscription'
import {
  daysUntil, totalMonthly, fmt,
} from '@/lib/utils'
import {
  ALERT_DANGER_DAYS, ALERT_WARN_DAYS,
  DASHBOARD_UPCOMING_LIMIT, RENEWAL_WINDOW_DAYS,
} from '@/lib/constants'
import { SubCard } from '../SubCard'

interface Props {
  subs:   Subscription[]
  onAdd:  () => void
  onEdit: (s: Subscription) => void
}

export function Dashboard({ subs, onAdd, onEdit }: Props) {
  const tot        = totalMonthly(subs)
  const yr         = tot * 12
  const thisMonth  = subs.filter(s => { const d = daysUntil(s.date); return d >= 0 && d <= RENEWAL_WINDOW_DAYS })
  const monthTotal = thisMonth.reduce((sum, s) => sum + s.price, 0)
  const urgent     = subs.filter(s => { const d = daysUntil(s.date); return d >= 0 && d <= ALERT_DANGER_DAYS })
  const soon       = subs.filter(s => { const d = daysUntil(s.date); return d > ALERT_DANGER_DAYS && d <= ALERT_WARN_DAYS })
  const upcoming   = [...subs]
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))
    .slice(0, DASHBOARD_UPCOMING_LIMIT)

  return (
    <>
      {/* Metrikler */}
      <div className="mrow">
        <div className="mc acc">
          <div className="ml">Aylık</div>
          <div className="mv">₺{fmt(tot)}</div>
          <div className="ms">{subs.length} aktif</div>
        </div>
        <div className="mc">
          <div className="ml">Yıllık</div>
          <div className="mv">₺{fmt(yr)}</div>
          <div className="ms">tahmini</div>
        </div>
        <div className="mc">
          <div className="ml">Bu Ay</div>
          <div className="mv">₺{fmt(monthTotal)}</div>
          <div className="ms">{thisMonth.length} yenileme</div>
        </div>
      </div>

      {/* Uyarılar */}
      {urgent.length > 0 && (
        <div className="alert hot" role="alert">
          <span aria-hidden="true" style={{ fontSize: 15 }}>🔴</span>
          <div>
            <div className="alert-title">
              {urgent.length === 1
                ? `${urgent[0].name} çok yakında yenileniyor`
                : `${urgent.length} abonelik çok yakında yenileniyor`}
            </div>
            <div className="alert-sub">
              {urgent.map(s => s.name).join(', ')} · ₺{fmt(urgent.reduce((s, x) => s + x.price, 0))} çekilecek
            </div>
          </div>
        </div>
      )}

      {soon.length > 0 && (
        <div className="alert warn" role="alert">
          <span aria-hidden="true" style={{ fontSize: 15 }}>🟡</span>
          <div>
            <div className="alert-title">Bu hafta {soon.length} yenileme</div>
            <div className="alert-sub">{soon.map(s => s.name).join(', ')}</div>
          </div>
        </div>
      )}

      {/* Yaklaşan yenilemeler */}
      <div className="sh">
        <span className="st">Yaklaşan Yenilemeler</span>
        <button className="btnp" onClick={onAdd} style={{ padding: '5px 11px', fontSize: 11 }}>
          + Ekle
        </button>
      </div>

      {upcoming.length === 0 ? (
        <p style={{ fontSize: 13, color: '#888899', textAlign: 'center', padding: '1rem' }}>
          Henüz abonelik yok.
        </p>
      ) : (
        upcoming.map(s => <SubCard key={s.id} sub={s} onEdit={onEdit} />)
      )}
    </>
  )
}
