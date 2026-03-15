import { Subscription } from '@/types/subscription'
import { daysUntil }     from '@/lib/utils'
import { SubCard }        from '../SubCard'

interface Props {
  subs:     Subscription[]
  onAdd:    () => void
  onEdit:   (s: Subscription) => void
  onDelete: (id: number) => void
}

export function SubList({ subs, onAdd, onEdit, onDelete }: Props) {
  const sorted = [...subs].sort((a, b) => daysUntil(a.date) - daysUntil(b.date))

  return (
    <>
      <div className="sh">
        <span className="st">Tüm Abonelikler</span>
        <button className="btnp" onClick={onAdd}>+ Yeni Ekle</button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">Henüz abonelik yok</div>
          <div className="empty-sub">Takip etmek istediğin abonelikleri ekle.</div>
          <button className="btnp" onClick={onAdd}>+ İlk Aboneliği Ekle</button>
        </div>
      ) : (
        sorted.map(s => (
          <SubCard
            key={s.id}
            sub={s}
            editable
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </>
  )
}
