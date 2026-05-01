import { useState, useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '../src/core/theme'
import { Tree } from '../src/tree'
import type { TreeNode, TreeRef } from '../src/tree'

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Tree>

// --- Icons (inline SVG to avoid any icon-library dependency) ---

function IconFolder({ open }: { open?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={open ? '#f59e0b' : '#94a3b8'}>
      {open
        ? <path d="M2 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        : <path d="M3 7a2 2 0 012-2h3.586l2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />}
    </svg>
  )
}

function IconFile() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
    </svg>
  )
}

// --- Shared data ---

const mailData: TreeNode[] = [
  {
    id: 'mail',
    value: 'Mail',
    icon: <IconFolder open />,
    $opened: true,
    items: [
      { id: 'inbox', value: 'Inbox', icon: <IconFile /> },
      { id: 'sent', value: 'Sent', icon: <IconFile /> },
      { id: 'drafts', value: 'Drafts', icon: <IconFile /> },
      { id: 'spam', value: 'Spam', icon: <IconFile />, disabled: true },
    ],
  },
  {
    id: 'team',
    value: 'Team',
    icon: <IconFolder />,
    items: [
      { id: 'alice', value: 'Alice', icon: <IconUser /> },
      { id: 'bob', value: 'Bob', icon: <IconUser /> },
      {
        id: 'projects',
        value: 'Projects',
        icon: <IconFolder />,
        items: [
          { id: 'proj-alpha', value: 'Alpha', icon: <IconFile /> },
          { id: 'proj-beta', value: 'Beta', icon: <IconFile /> },
        ],
      },
    ],
  },
  {
    id: 'archive',
    value: 'Archive',
    icon: <IconFolder />,
    items: [
      { id: 'archive-2023', value: '2023', icon: <IconFolder /> },
      { id: 'archive-2024', value: '2024', icon: <IconFolder /> },
    ],
  },
]

function cloneData(): TreeNode[] {
  function cloneNode(node: TreeNode): TreeNode {
    const { items, ...rest } = node
    return items ? { ...rest, items: items.map(cloneNode) } : { ...rest }
  }
  return mailData.map(cloneNode)
}

// --- Stories ---

export const Default: Story = {
  args: {
    data: mailData,
    style: { width: 280, minHeight: 300 },
  } as Story['args'] & { style?: React.CSSProperties },
  parameters: {
    docs: { description: { story: 'Basic tree with icons, nested items, and one disabled leaf.' } },
  },
}

export const WithCheckboxes: Story = {
  args: {
    data: mailData,
    checkbox: true,
    style: { width: 280 },
  } as Story['args'] & { style?: React.CSSProperties },
}

export const Editable: Story = {
  args: {
    data: mailData,
    editable: true,
    checkbox: true,
    style: { width: 280 },
  } as Story['args'] & { style?: React.CSSProperties },
  parameters: {
    docs: { description: { story: 'Double-click a label to edit it inline. Press Enter to commit, Escape to cancel.' } },
  },
}

export const Draggable: Story = {
  render: () => {
    const [log, setLog] = useState<string[]>([])
    const data = cloneData()
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <Tree
          data={data}
          dragItem="both"
          style={{ width: 280 }}
          onDrop={(dragId, targetId, position) => {
            setLog((prev) => [`drop "${dragId}" ${position} "${targetId}"`, ...prev.slice(0, 4)])
          }}
        />
        <div style={{ fontSize: 12, color: '#64748b', minWidth: 200 }}>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>Drop log</div>
          {log.length === 0
            ? <div style={{ fontStyle: 'italic' }}>Drag a node to see events</div>
            : log.map((entry, i) => <div key={i}>{entry}</div>)}
        </div>
      </div>
    )
  },
  parameters: {
    docs: { description: { story: 'dragItem="both" — nodes are draggable sources and drop targets.' } },
  },
}

export const ControlledExpansion: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(['mail'])
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <Tree
          data={mailData}
          expanded={expanded}
          onExpand={(id) => setExpanded((prev) => [...prev, id])}
          onCollapse={(id) => setExpanded((prev) => prev.filter((x) => x !== id))}
          style={{ width: 280 }}
        />
        <div style={{ fontSize: 12, color: '#64748b', minWidth: 140 }}>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>expanded</div>
          {expanded.length === 0
            ? <div style={{ fontStyle: 'italic' }}>none</div>
            : expanded.map((id) => <div key={id}>{id}</div>)}
        </div>
      </div>
    )
  },
  parameters: {
    docs: { description: { story: 'Controlled mode — the parent owns expanded state. onExpand/onCollapse fire with the single toggled id.' } },
  },
}

export const ImperativeApi: Story = {
  render: () => {
    const ref = useRef<TreeRef>(null)
    return (
      <div style={{ width: 280 }}>
        <Tree ref={ref} data={mailData} checkbox editable />
        <div style={{ display: 'flex', gap: 8, paddingTop: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => ref.current?.expandAll()}>Expand all</button>
          <button type="button" onClick={() => ref.current?.collapseAll()}>Collapse all</button>
          <button type="button" onClick={() => ref.current?.expand('team')}>Expand Team</button>
          <button type="button" onClick={() => ref.current?.collapse('mail')}>Collapse Mail</button>
          <button type="button" onClick={() => ref.current?.select(['inbox'])}>Select Inbox</button>
          <button type="button" onClick={() => ref.current?.check(['inbox', 'sent'])}>Check Inbox+Sent</button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: { description: { story: 'Imperative ref API: expand, collapse, expandAll, collapseAll, select, check.' } },
  },
}
