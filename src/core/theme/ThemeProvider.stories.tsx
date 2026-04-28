import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from './ThemeProvider'

const DemoContent = () => (
  <div style={{ padding: 'var(--rgs-spacing-md)' }}>
    <h2 style={{ margin: 0 }}>Theme Demo</h2>
    <p style={{ color: 'var(--rgs-color-text-secondary)' }}>
      This text uses theme tokens via CSS custom properties.
    </p>
    <button
      style={{
        backgroundColor: 'var(--rgs-color-primary)',
        color: '#fff',
        border: 'none',
        padding: 'var(--rgs-spacing-sm) var(--rgs-spacing-md)',
        borderRadius: 'var(--rgs-radius-md)',
        cursor: 'pointer',
        fontSize: 'var(--rgs-font-size-md)',
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
