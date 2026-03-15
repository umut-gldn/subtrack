'use client'
import { Component, ReactNode } from 'react'

interface Props  { children: ReactNode }
interface State  { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message }
  }

  componentDidCatch(err: Error) {
    // Prod'da buraya Sentry/Datadog bağlanabilir
    console.error('[subtrack] Uncaught error:', err)
  }

  handleReset = () => {
    // localStorage'ı temizleyip yeniden başlat
    try { localStorage.removeItem('subtrack_v1') } catch {}
    this.setState({ hasError: false, message: '' })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        maxWidth: 400, margin: '4rem auto', padding: '2rem',
        background: '#fff0f0', border: '2px solid #e03030',
        borderRadius: 14, textAlign: 'center', fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#b02020', marginBottom: 8 }}>
          Bir şeyler ters gitti
        </div>
        <div style={{ fontSize: 12, color: '#666677', marginBottom: 20 }}>
          Uygulama beklenmedik bir hatayla karşılaştı.
          {this.state.message && (
            <code style={{ display: 'block', marginTop: 8, fontSize: 11, color: '#888' }}>
              {this.state.message}
            </code>
          )}
        </div>
        <button
          onClick={this.handleReset}
          style={{
            background: '#5b4cf5', border: 'none', color: '#fff',
            padding: '8px 20px', borderRadius: 8, fontSize: 13,
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          Sıfırla ve yeniden başlat
        </button>
      </div>
    )
  }
}
