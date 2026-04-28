import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from './ThemeProvider'

const DemoContent = () => (
  <div style={{ padding: 'var(--react-tree-grid-spacing-md)' }}>
    <h2 style={{ margin: 0 }}>Theme Demo</h2>
    <p style={{ color: 'var(--react-tree-grid-color-text-secondary)' }}>
      This text uses theme tokens via CSS custom properties.
    </p>
    <button
      style={{
        backgroundColor: 'var(--react-tree-grid-color-primary)',
        color: '#fff',
        border: 'none',
        padding: 'var(--react-tree-grid-spacing-sm) var(--react-tree-grid-spacing-md)',
        borderRadius: 'var(--react-tree-grid-radius-md)',
        cursor: 'pointer',
        fontSize: 'var(--react-tree-grid-font-size-md)',
      }}
    >
      Primary Button
    </button>
  </div>
)

const meta: Meta<typeof ThemeProvider> = {
  title: 'Core/ThemeProvider',
  component: ThemeProvider,
}

export default meta
type Story = StoryObj<typeof ThemeProvider>

export const Light: Story = {
  args: { theme: 'light' },
  render: (args) => (
    <ThemeProvider {...args}>
      <DemoContent />
    </ThemeProvider>
  ),
}

export const Dark: Story = {
  args: { theme: 'dark' },
  render: (args) => (
    <ThemeProvider {...args}>
      <DemoContent />
    </ThemeProvider>
  ),
}

export const CustomOverrides: Story = {
  args: {
    theme: 'light',
    overrides: { colorPrimary: '#e91e63', colorBackground: '#fff3e0' },
  },
  render: (args) => (
    <ThemeProvider {...args}>
      <DemoContent />
    </ThemeProvider>
  ),
}
