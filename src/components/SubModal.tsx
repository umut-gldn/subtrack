'use client'
import { useState, useEffect } from 'react'
import { Subscription, IconKey, Cycle, ICON_META } from '@/types/subscription'

interface Props {
  sub?:     Subscription | null
  onSave:   (s: Omit<Subscription, 'id'> & { id?: number }) => void
  onClose:  () => void
}

const today = new Date().toISOString().split('T')[0]
const ICON_KEYS = Object.keys(ICON_META) as IconKey[]

export function SubModal({ sub, onSave, onClose }: Props) {
  const [name,  setName]  = useState('')
  const [price, setPrice] = useState('')
  const [cycle, setCycle] = useState<Cycle>('monthly')
  const [date,  setDate]  = useState(today)
  const [icon,  setIcon]  = useState<IconKey>('other')

  useEffect(() => {
    if (sub) {
      setName(sub.name); setPrice(String(sub.price))
      setCycle(sub.cycle); setDate(sub.date); setIcon(sub.icon)
    } else {
      setName(''); setPrice(''); setCycle('monthly'); setDate(today); setIcon('other')
    }
  }, [sub])

  const handleSave = () => {
    const p = parseFloat(price)
    if (!name.trim())                          return
    if (isNaN(p) || p < 0)                    return
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return
    onSave({ id: sub?.id, name: name.trim(), price: p, cycle, date, icon })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{sub ? 'Düzenle' : 'Yeni Abonelik'}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Ad */}
          <div className="fg">
            <div className="fl">Abonelik Adı</div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Netflix, Spotify..."
              autoFocus
            />
          </div>

          {/* Fiyat + Dönem */}
          <div className="fg2">
            <div className="fg">
              <div className="fl">Fiyat (₺)</div>
              <input
                type="number" min="0" step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="fg">
              <div className="fl">Dönem</div>
              <select value={cycle} onChange={e => setCycle(e.target.value as Cycle)}>
                <option value="monthly">Aylık</option>
                <option value="yearly">Yıllık</option>
                <option value="weekly">Haftalık</option>
              </select>
            </div>
          </div>

          {/* Tarih */}
          <div className="fg">
            <div className="fl">Sonraki Yenileme</div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {/* İkon picker */}
          <div className="fg">
            <div className="fl">Kategori</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 6,
              marginTop: 2,
            }}>
              {ICON_KEYS.map(key => {
                const m = ICON_META[key]
                const selected = icon === key
                return (
                  <button
                    key={key}
                    onClick={() => setIcon(key)}
                    title={m.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3,
                      padding: '8px 4px',
                      border: selected ? `2px solid ${m.hex}` : '2px solid #c0c0d0',
                      borderRadius: 8,
                      background: selected ? m.bg : 'transparent',
                      cursor: 'pointer',
                      transition: 'all .12s',
                    }}
                  >
                    <span style={{ fontSize: 18, lineHeight: 1 }}>{m.emoji}</span>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: selected ? m.text : '#888899',
                      whiteSpace: 'nowrap',
                    }}>
                      {m.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>İptal</button>
          <button className="btnp" onClick={handleSave}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}
