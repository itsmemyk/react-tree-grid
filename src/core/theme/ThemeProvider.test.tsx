import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeProvider'

function ThemeDisplay() {
  const { theme } = useTheme()
  return <div data-testid="theme-name">{theme}</div>
}

describe('ThemeProvider', () => {
  it('provides light theme by default', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme-name')).toHaveTextContent('light')
  })

  it('provides the specified theme', () => {
    render(
      <ThemeProvider theme="dark">
        <ThemeDisplay />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme-name')).toHaveTextContent('dark')
  })

  it('applies CSS custom properties to the container', () => {
    const { container } = render(
      <ThemeProvider theme="light">
        <div>child</div>
      </ThemeProvider>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    const style = wrapper.getAttribute('style') || ''
    expect(style).toContain('--react-tree-grid-color-primary')
    expect(style).toContain('--react-tree-grid-color-background')
  })

  it('applies overrides on top of preset', () => {
    const { container } = render(
      <ThemeProvider theme="light" overrides={{ colorPrimary: '#ff0000' }}>
        <div>child</div>
      </ThemeProvider>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    const style = wrapper.getAttribute('style') || ''
    expect(style).toContain('--react-tree-grid-color-primary: #ff0000')
  })
})
