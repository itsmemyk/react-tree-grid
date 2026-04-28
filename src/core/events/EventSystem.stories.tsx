import { useState, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEventSystem } from './useEventSystem'
import { ThemeProvider } from '../theme'

function EventDemo() {
  const { on, fire, detach, clear } = useEventSystem()
  const [log, setLog] = useState<string[]>([])

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [...prev.slice(-19), msg])
  }, [])

  const setupListeners = useCallback(() => {
    clear()
    on('click', (x: unknown, y: unknown) => {
      addLog(`click handler: x=${x}, y=${y}`)
    })
    on('beforeSave', (data: unknown) => {
      addLog(`beforeSave: validating ${JSON.stringify(data)}`)
      return true // allow
    })
    on('afterSave', (data: unknown) => {
      addLog(`afterSave: saved ${JSON.stringify(data)}`)
    })
    addLog('-- Listeners registered (click, beforeSave, afterSave) --')
  }, [on, clear, addLog])

  const setupVetoListener = useCallback(() => {
    on('beforeSave', () => {
      addLog('beforeSave VETO: returning false!')
      return false // block
    })
    addLog('-- Added veto listener on beforeSave --')
  }, [on, addLog])

  const fireClick = useCallback(() => {
    const result = fire('click', [Math.round(Math.random() * 500), Math.round(Math.random() * 500)])
    addLog(`fire("click") returned: ${result}`)
  }, [fire, addLog])

  const fireSave = useCallback(() => {
    const data = { id: Math.round(Math.random() * 100), name: 'test' }
    const allowed = fire('beforeSave', [data])
    addLog(`fire("beforeSave") returned: ${allowed} (${allowed ? 'ALLOWED' : 'VETOED'})`)
    if (allowed) {
      fire('afterSave', [data])
    }
  }, [fire, addLog])

  const detachAll = useCallback(() => {
    detach('beforeSave')
    addLog('-- Detached all beforeSave handlers --')
  }, [detach, addLog])

  const clearAll = useCallback(() => {
    clear()
    addLog('-- Cleared ALL handlers --')
  }, [clear, addLog])

  const btnStyle: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: 'var(--react-tree-grid-radius-md)',
    border: '1px solid var(--react-tree-grid-color-border)',
    background: 'var(--react-tree-grid-color-surface)',
    color: 'var(--react-tree-grid-color-text)',
    cursor: 'pointer',
    fontSize: 'var(--react-tree-grid-font-size-sm)',
  }

  const primaryBtn: React.CSSProperties = {
    ...btnStyle,
    background: 'var(--react-tree-grid-color-primary)',
    color: '#fff',
    border: 'none',
  }

  const dangerBtn: React.CSSProperties = {
    ...btnStyle,
    background: 'var(--react-tree-grid-color-danger)',
    color: '#fff',
    border: 'none',
  }

  return (
    <div style={{ padding: 'var(--react-tree-grid-spacing-md)', fontFamily: 'var(--react-tree-grid-font-family)' }}>
      <h2 style={{ margin: '0 0 8px' }}>EventSystem Demo</h2>
      <p style={{ color: 'var(--react-tree-grid-color-text-secondary)', margin: '0 0 16px' }}>
        Demonstrates event subscription, firing, veto pattern, and detach.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button style={primaryBtn} onClick={setupListeners}>1. Setup Listeners</button>
        <button style={btnStyle} onClick={fireClick}>Fire "click"</button>
        <button style={btnStyle} onClick={fireSave}>Fire "beforeSave → afterSave"</button>
        <button style={dangerBtn} onClick={setupVetoListener}>Add Veto Listener</button>
        <button style={btnStyle} onClick={detachAll}>Detach beforeSave</button>
        <button style={btnStyle} onClick={clearAll}>Clear All</button>
      </div>

      <div
        style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: 12,
          borderRadius: 'var(--react-tree-grid-radius-md)',
          fontFamily: 'monospace',
          fontSize: 12,
          height: 300,
          overflowY: 'auto',
        }}
      >
        {log.length === 0 ? (
          <span style={{ color: '#666' }}>Click "1. Setup Listeners" to begin...</span>
        ) : (
          log.map((entry, i) => (
            <div key={i} style={{ marginBottom: 2, color: entry.includes('VETO') ? '#f44336' : entry.startsWith('--') ? '#90caf9' : '#d4d4d4' }}>
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Core/EventSystem',
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Interactive: Story = {
  render: () => <EventDemo />,
}
