import type { Meta, StoryObj } from '@storybook/react-vite'
import { TreeGrid } from '../src/treegrid'
import type { TreeGridRow } from '../src/treegrid'

interface OrgRow extends TreeGridRow {
  id: string
  name: string
  role: string
  department: string
  headcount?: number
  parent?: string
}

const columns = [
  { id: 'name', header: [{ text: 'Name' }], width: 220 },
  { id: 'role', header: [{ text: 'Role' }], width: 160 },
  { id: 'department', header: [{ text: 'Department' }], width: 150 },
  { id: 'headcount', header: [{ text: 'Headcount' }], width: 110, align: 'right' as const },
]

const data: OrgRow[] = [
  { id: 'ceo', name: 'Sarah Connor', role: 'CEO', department: 'Executive', headcount: 120, $opened: true },
  { id: 'cto', name: 'Miles Dyson', role: 'CTO', department: 'Technology', headcount: 45, parent: 'ceo', $opened: true },
  { id: 'eng1', name: 'Kyle Reese', role: 'Lead Engineer', department: 'Backend', parent: 'cto' },
  { id: 'eng2', name: 'John Connor', role: 'Lead Engineer', department: 'Frontend', parent: 'cto' },
  { id: 'cmo', name: 'Cameron Phillips', role: 'CMO', department: 'Marketing', headcount: 18, parent: 'ceo' },
  { id: 'mkt1', name: 'Derek Reese', role: 'Marketing Manager', department: 'Growth', parent: 'cmo' },
  { id: 'cfo', name: 'T-800', role: 'CFO', department: 'Finance', headcount: 12, parent: 'ceo' },
]

const meta: Meta<typeof TreeGrid> = {
  title: 'Components/TreeGrid',
  component: TreeGrid,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof TreeGrid>

export const Basic: Story = {
  args: {
    columns,
    data,
    treeColumnId: 'name',
    style: { width: 680, height: 320 },
  },
}

export const CollapsedByDefault: Story = {
  args: {
    columns,
    data: data.map((row) => ({ ...row, $opened: false })),
    treeColumnId: 'name',
    collapsed: true,
    style: { width: 680, height: 320 },
  },
}

export const Sortable: Story = {
  args: {
    columns,
    data,
    treeColumnId: 'name',
    sortable: true,
    style: { width: 680, height: 320 },
  },
}

export const Editable: Story = {
  args: {
    columns,
    data,
    treeColumnId: 'name',
    editable: true,
    style: { width: 680, height: 320 },
  },
}
