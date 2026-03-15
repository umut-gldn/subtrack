'use client'
import { useEffect, useRef } from 'react'

interface Props {
  title:     string
  body?:     string
  confirmLabel?: string
  onConfirm: () => void
  onCancel:  () => void
}

export function ConfirmModal({ title, body, confirmLabel = 'Sil', onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  // ESC ile kapat, focus trap
  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={onCancel}
    >
      <div
        className="modal"
        style={{ maxWidth: 300 }}
        onClick={e => e.stopPropagation()}
      >
        <div id="confirm-title" className="modal-title">{title}</div>
        {body && (
          <p style={{ fontSize: 13, color: '#666677', marginBottom: 4 }}>{body}</p>
        )}
        <div className="modal-actions">
          <button ref={cancelRef} className="btn" onClick={onCancel}>
            İptal
          </button>
          <button
            className="btnp"
            style={{ background: '#e03030', borderColor: '#e03030' }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
