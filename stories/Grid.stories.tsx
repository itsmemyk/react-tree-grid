import type { Meta, StoryObj } from '@storybook/react-vite'
import { Grid } from '../src/grid'

interface Employee {
  id: string
  name: string
  department: string
  salary: number
  status: string
}

const columns = [
  { id: 'name', header: [{ text: 'Name' }], width: 180 },
  { id: 'department', header: [{ text: 'Department' }], width: 160 },
  { id: 'salary', header: [{ text: 'Salary' }], width: 120, align: 'right' as const },
  { id: 'status', header: [{ text: 'Status' }], width: 120 },
]

const data: Employee[] = [
  { id: '1', name: 'Alice Johnson', department: 'Engineering', salary: 95000, status: 'Active' },
  { id: '2', name: 'Bob Smith', department: 'Design', salary: 82000, status: 'Active' },
  { id: '3', name: 'Carol White', department: 'Engineering', salary: 110000, status: 'Active' },
  { id: '4', name: 'David Brown', department: 'Marketing', salary: 76000, status: 'On Leave' },
  { id: '5', name: 'Eva Martinez', department: 'Engineering', salary: 98000, status: 'Active' },
  { id: '6', name: 'Frank Lee', department: 'Design', salary: 88000, status: 'Active' },
  { id: '7', name: 'Grace Kim', department: 'HR', salary: 72000, status: 'Active' },
  { id: '8', name: 'Henry Davis', department: 'Marketing', salary: 79000, status: 'Inactive' },
]

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Grid>

export const Basic: Story = {
  args: {
    columns,
    data,
    style: { width: 640, height: 320 },
  },
}

export const Sortable: Story = {
  args: {
    columns,
    data,
    sortable: true,
    style: { width: 640, height: 320 },
  },
}

export const RowSelection: Story = {
  args: {
    columns,
    data,
    selection: 'row',
    multiselection: true,
    style: { width: 640, height: 320 },
  },
}

export const Editable: Story = {
  args: {
    columns,
    data,
    editable: true,
    style: { width: 640, height: 320 },
  },
}

export const FrozenColumns: Story = {
  args: {
    columns,
    data,
    leftSplit: 1,
    style: { width: 640, height: 320 },
  },
}

export const WithTooltip: Story = {
  args: {
    columns: columns.map((col) => ({ ...col, tooltipTemplate: (v: unknown) => String(v) })),
    data,
    tooltip: true,
    style: { width: 640, height: 320 },
  },
}
