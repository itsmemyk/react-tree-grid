import { useState, useCallback, useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { uid, extend, copy, isDefined, isId, isNumeric, isEmptyObj } from './common'
import { locate, getBox } from './dom'
import { ThemeProvider } from '../theme'

function UtilitiesDemo() {
  const [log, setLog] = useState<string[]>([])
  const boxRef = useRef<HTMLDivElement>(null)

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [...prev.slice(-19), msg])
  }, [])

  const demoUid = useCallback(() => {
    addLog(`uid() → "${uid()}"`)
    addLog(`uid() → "${uid()}"`)
    addLog(`uid() → "${uid()}"`)
  }, [addLog])

  const demoExtend = useCallback(() => {
    const target = { a: 1, nested: { x: 10, y: 20 } }
    const source = { b: 2, nested: { y: 99 } }
    const result = extend({ ...target, nested: { ...target.nested } }, source)
    addLog(`extend({ a:1, nested:{x:10,y:20} }, { b:2, nested:{y:99} })`)
    addLog(`  → ${JSON.stringify(result)}`)
  }, [addLog])

  const demoCopy = useCallback(() => {
    const obj = { id: '1', name: 'test', $internal: 'hidden' }
    const full = copy(obj)
    const clean = copy(obj, true)
    addLog(`copy({ id:"1", name:"test", $internal:"hidden" })`)
    addLog(`  full  → ${JSON.stringify(full)}`)
    addLog(`  clean → ${JSON.stringify(clean)}`)
  }, [addLog])

  const demoTypeChecks = useCallback(() => {
    const checks = [
      ['isDefined(0)', isDefined(0)],
      ['isDefined(null)', isDefined(null)],
      ['isDefined(undefined)', isDefined(undefined)],
      ['isId("abc")', isId('abc')],
      ['isId("")', isId('')],
      ['isId(42)', isId(42)],
      ['isNumeric("3.14")', isNumeric('3.14')],
      ['isNumeric("abc")', isNumeric('abc')],
      ['isEmptyObj({})', isEmptyObj({})],
      ['isEmptyObj({a:1})', isEmptyObj({ a: 1 })],
    ] as const
    for (const [expr, result] of checks) {
      addLog(`${expr} → ${result}`)
    }
  }, [addLog])

  const demoLocate = useCallback((e: React.MouseEvent) => {
    const id = locate(e.nativeEvent, 'data-rgs-id')
    addLog(`locate(event, "data-rgs-id") → "${id}"`)
  }, [addLog])

  const demoGetBox = useCallback(() => {
    if (!boxRef.current) return
    const box = getBox(boxRef.current)
    addLog(`getBox() → ${JSON.stringify(box)}`)
  }, [addLog])

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
      <h2 style={{ margin: '0 0 8px' }}>Core Utilities Demo</h2>
      <p style={{ color: 'var(--react-tree-grid-color-text-secondary)', margin: '0 0 16px' }}>
        Faithful conversions of DHTMLX utility functions.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button style={btnStyle} onClick={demoUid}>uid()</button>
        <button style={btnStyle} onClick={demoExtend}>extend()</button>
        <button style={btnStyle} onClick={demoCopy}>copy()</button>
        <button style={btnStyle} onClick={demoTypeChecks}>Type Checks</button>
        <button style={btnStyle} onClick={demoGetBox}>getBox(target)</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div
          ref={boxRef}
          data-rgs-id="item-A"
          onClick={demoLocate}
          style={{
            padding: '12px 20px',
            background: 'var(--react-tree-grid-color-primary)',
            color: '#fff',
            borderRadius: 'var(--react-tree-grid-radius-md)',
            cursor: 'pointer',
          }}
        >
          Click me (data-rgs-id="item-A")
        </div>
        <div
          data-rgs-id="item-B"
          onClick={demoLocate}
          style={{
            padding: '12px 20px',
            background: 'var(--react-tree-grid-color-secondary)',
            color: '#fff',
            borderRadius: 'var(--react-tree-grid-radius-md)',
            cursor: 'pointer',
          }}
        >
          Click me (data-rgs-id="item-B")
        </div>
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
          <span style={{ color: '#666' }}>Click any button or colored box to see results...</span>
        ) : (
          log.map((entry, i) => (
            <div key={i} style={{ marginBottom: 2, color: entry.startsWith('  ') ? '#90caf9' : '#d4d4d4' }}>
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Core/Utilities',
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
  render: () => <UtilitiesDemo />,
}
