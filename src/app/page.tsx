'use client'
import { useState, useEffect } from 'react'
import { useSubscriptions }    from '@/hooks/useSubscriptions'
import { useTheme }            from '@/hooks/useTheme'
import { useNotifications }    from '@/hooks/useNotifications'
import { Subscription }        from '@/types/subscription'
import { NOTIF_DISMISSED_KEY } from '@/lib/constants'
import { SubModal }            from '@/components/SubModal'
import { NotificationBanner }  from '@/components/NotificationBanner'
import { ConfirmModal }        from '@/components/ui/ConfirmModal'
import { Dashboard }           from '@/components/tabs/Dashboard'
import { SubList }             from '@/components/tabs/SubList'
import { Analytics }           from '@/components/tabs/Analytics'
import { Calendar }            from '@/components/tabs/Calendar'

type Tab = 'dash' | 'list' | 'chart' | 'cal'

const TABS: { key: Tab; label: string }[] = [
  { key: 'dash',  label: 'Panel'        },
  { key: 'list',  label: 'Abonelikler'  },
  { key: 'chart', label: 'Analiz'       },
  { key: 'cal',   label: 'Takvim'       },
]

export default function Home() {
  const { subs, loaded, add, update, remove } = useSubscriptions()
  const { dark, toggle }                      = useTheme()
  const { permission, requestPermission }     = useNotifications(subs)

  const [tab,             setTab]             = useState<Tab>('dash')
  const [editSub,         setEditSub]         = useState<Subscription | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const [notifDismissed,  setNotifDismissed]  = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(NOTIF_DISMISSED_KEY)) setNotifDismissed(true)
  }, [])

  const dismissNotif = () => {
    setNotifDismissed(true)
    sessionStorage.setItem(NOTIF_DISMISSED_KEY, '1')
  }

  const [subModalOpen, setSubModalOpen] = useState(false)

  const handleOpenAdd  = () => { setEditSub(null); setSubModalOpen(true) }
  const handleOpenEdit = (s: Subscription) => { setEditSub(s); setSubModalOpen(true) }
  const handleCloseModal = () => { setSubModalOpen(false); setEditSub(null) }
  const handleSave = (s: Omit<Subscription, 'id'> & { id?: number }) => {
    if (s.id) update(s as Subscription)
    else add(s)
    handleCloseModal()
  }

  const confirmDelete = () => {
    if (pendingDeleteId !== null) remove(pendingDeleteId)
    setPendingDeleteId(null)
  }

  if (!loaded) return null

  const pendingSub = pendingDeleteId !== null
    ? subs.find(s => s.id === pendingDeleteId)
    : null

  return (
    <div className="wrapper">
      {/* Top bar */}
      <div className="topbar">
        <div className="brand">sub<em>track</em></div>
        <button className="theme-btn" onClick={toggle} aria-label="Tema değiştir">
          {dark ? '☀️ Açık mod' : '🌙 Koyu mod'}
        </button>
      </div>

      {/* Bildirim izin banner'ı */}
      {!notifDismissed && (
        <NotificationBanner
          permission={permission}
          onRequest={requestPermission}
          onDismiss={dismissNotif}
        />
      )}

      {/* Tabs */}
      <nav className="tabs" aria-label="Sayfalar">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
            aria-selected={tab === t.key}
            role="tab"
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab içeriği */}
      <main>
        {tab === 'dash'  && <Dashboard subs={subs} onAdd={handleOpenAdd} onEdit={handleOpenEdit} />}
        {tab === 'list'  && <SubList   subs={subs} onAdd={handleOpenAdd} onEdit={handleOpenEdit} onDelete={setPendingDeleteId} />}
        {tab === 'chart' && <Analytics subs={subs} dark={dark} />}
        {tab === 'cal'   && <Calendar  subs={subs} dark={dark} />}
      </main>

      {/* Abonelik ekle/düzenle modal */}
      {subModalOpen && (
        <SubModal
          sub={editSub}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      {/* Silme onayı */}
      {pendingSub && (
        <ConfirmModal
          title="Aboneliği sil"
          body={`"${pendingSub.name}" silinecek. Bu işlem geri alınamaz.`}
          confirmLabel="Sil"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  )
}
