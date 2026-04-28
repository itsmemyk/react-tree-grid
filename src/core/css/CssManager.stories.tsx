import { useState, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useCssManager } from './useCssManager'
import { ThemeProvider } from '../theme'

function CssManagerDemo() {
  const css = useCssManager()
  const [classes, setClasses] = useState<string[]>([])
  const [log, setLog] = useState<string[]>([])

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [...prev.slice(-14), msg])
  }, [])

  const addRedBox = useCallback(() => {
    const cls = css.add({
      backgroundColor: '#f44336',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      fontWeight: 'bold',
    })
    setClasses((prev) => [...prev, cls])
    addLog(`Added class: ${cls} (red box)`)
  }, [css, addLog])

  const addBlueBox = useCallback(() => {
    const cls = css.add({
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      fontStyle: 'italic',
    })
    setClasses((prev) => [...prev, cls])
    addLog(`Added class: ${cls} (blue box)`)
  }, [css, addLog])

  const addGradientBox = useCallback(() => {
    const cls = css.add({
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    })
    setClasses((prev) => [...prev, cls])
    addLog(`Added class: ${cls} (gradient box)`)
  }, [css, addLog])

  const addDuplicate = useCallback(() => {
    const cls = css.add({
      backgroundColor: '#f44336',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      fontWeight: 'bold',
    })
    setClasses((prev) => [...prev, cls])
    addLog(`Added duplicate red — reused existing class: ${cls}`)
  }, [css, addLog])

  const removeLastClass = useCallback(() => {
    if (classes.length === 0) return
    const last = classes[classes.length - 1]
    css.remove(last)
    setClasses((prev) => prev.slice(0, -1))
    addLog(`Removed class: ${last}`)
  }, [css, classes, addLog])

  const inspectClass = useCallback(() => {
    if (classes.length === 0) return
    const last = classes[classes.length - 1]
    const props = css.get(last)
    addLog(`Inspect ${last}: ${JSON.stringify(props)}`)
  }, [css, classes, addLog])

  const btnStyle: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: 'var(--react-tree-grid-radius-md)',
    border: '1px solid var(--react-tree-grid-color-border)',
    background: 'var(--react-tree-grid-color-surface)',
    color: 'var(--react-tree-grid-color-text)',
    cursor: 'pointer',
    fontSize: 'var(--react-tree-grid-font-size-sm)',
  }

  return (
    <div style={{ padding: 'var(--react-tree-grid-spacing-md)', fontFamily: 'var(--react-tree-grid-font-family)' }}>
      <h2 style={{ margin: '0 0 8px' }}>CssManager Demo</h2>
      <p style={{ color: 'var(--react-tree-grid-color-text-secondary)', margin: '0 0 16px' }}>
        Dynamically generates CSS classes and injects them into a &lt;style&gt; tag.
        Duplicate CSS is automatically deduplicated.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button style={btnStyle} onClick={addRedBox}>+ Red Box</button>
        <button style={btnStyle} onClick={addBlueBox}>+ Blue Box</button>
        <button style={btnStyle} onClick={addGradientBox}>+ Gradient Box</button>
        <button style={btnStyle} onClick={addDuplicate}>+ Duplicate Red (dedup)</button>
        <button style={btnStyle} onClick={removeLastClass}>- Remove Last</button>
        <button style={btnStyle} onClick={inspectClass}>Inspect Last</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, minHeight: 50 }}>
        {classes.map((cls, i) => (
          <div key={`${cls}-${i}`} className={cls}>
            {cls}
          </div>
        ))}
      </div>

      <div
        style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: 12,
          borderRadius: 'var(--react-tree-grid-radius-md)',
          fontFamily: 'monospace',
          fontSize: 12,
          height: 200,
          overflowY: 'auto',
        }}
      >
        {log.length === 0 ? (
          <span style={{ color: '#666' }}>Click a button to add dynamic CSS classes...</span>
        ) : (
          log.map((entry, i) => (
            <div key={i} style={{ marginBottom: 2, color: entry.includes('reused') ? '#66bb6a' : '#d4d4d4' }}>
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Core/CssManager',
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
  render: () => <CssManagerDemo />,
}
