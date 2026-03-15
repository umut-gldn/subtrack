'use client'

interface Props {
  permission: 'default' | 'granted' | 'denied' | 'unsupported'
  onRequest: () => void
  onDismiss: () => void
}

export function NotificationBanner({ permission, onRequest, onDismiss }: Props) {
  if (permission === 'granted' || permission === 'unsupported') return null

  if (permission === 'denied') {
    return (
      <div style={{
        background: '#fff8ec', border: '2px solid #e8a020', borderRadius: 10,
        padding: '10px 13px', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 9,
      }}>
        <span style={{ fontSize: 15 }}>🔕</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8a5000' }}>
            Bildirimler engellendi
          </div>
          <div style={{ fontSize: 11, color: '#666677', marginTop: 1 }}>
            Tarayıcı ayarlarından bu site için bildirimlere izin verebilirsin.
          </div>
        </div>
      </div>
    )
  }

  // default → ask
  return (
    <div style={{
      background: '#f0eeff', border: '2px solid #b8b0ff', borderRadius: 10,
      padding: '10px 13px', marginBottom: 12,
      display: 'flex', alignItems: 'center', gap: 9,
    }}>
      <span style={{ fontSize: 15 }}>🔔</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#4a3cc0' }}>
          Yenileme bildirimleri al
        </div>
        <div style={{ fontSize: 11, color: '#666677', marginTop: 1 }}>
          Abonelik yenilenmeden 3 gün, 1 gün ve gün içinde haber verelim.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={onDismiss}
          style={{
            background: 'none', border: '2px solid #c0c0d8', color: '#666688',
            padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Şimdi değil
        </button>
        <button
          onClick={onRequest}
          style={{
            background: '#5b4cf5', border: '2px solid #5b4cf5', color: '#fff',
            padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 2px 6px rgba(91,76,245,.35)',
          }}
        >
          İzin ver
        </button>
      </div>
    </div>
  )
}
