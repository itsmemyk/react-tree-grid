import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ThemeTokens } from './tokens'
import { tokensToCssVars } from './tokens'
import { lightTheme } from './presets/light'
import { darkTheme } from './presets/dark'
import styles from './theme.module.css'

export type ThemeName = 'light' | 'dark'

const RGS_THEME_ATTR = 'data-rgs-theme'

interface ThemeContextValue {
  theme: ThemeName
  tokens: ThemeTokens
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  tokens: lightTheme,
})

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

const presets: Record<ThemeName, ThemeTokens> = {
  light: lightTheme,
  dark: darkTheme,
}

export interface ThemeProviderProps {
  theme?: ThemeName
  overrides?: Partial<ThemeTokens>
  children: ReactNode
}

export function ThemeProvider({
  theme = 'light',
  overrides,
  children,
}: ThemeProviderProps) {
  const tokens = useMemo(() => {
    const base = presets[theme]
    return overrides ? { ...base, ...overrides } : base
  }, [theme, overrides])

  const cssVars = useMemo(() => tokensToCssVars(tokens), [tokens])

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ theme, tokens }),
    [theme, tokens],
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        className={styles.themeRoot}
        style={cssVars}
        {...{ [RGS_THEME_ATTR]: theme }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

/**
 * Detect parent theme by walking up the DOM to find the nearest [data-rgs-theme] attribute.
 * Returns the theme name or null if not found.
 */
export function detectTheme(element: HTMLElement): ThemeName | null {
  const themed = element.closest(`[${RGS_THEME_ATTR}]`)
  if (themed) {
    return themed.getAttribute(RGS_THEME_ATTR) as ThemeName
  }
  return null
}

/**
 * Imperative theme setter — faithful conversion of DHTMLX setTheme (suite.js lines 173-183).
 * Sets data-rgs-theme attribute on a container (defaults to document.documentElement).
 * If no container is given, clears all existing data-rgs-theme attributes first.
 */
export function setTheme(
  theme: ThemeName = 'light',
  container?: HTMLElement,
): void {
  if (!container) {
    const elements = document.querySelectorAll(`[${RGS_THEME_ATTR}]`)
    elements.forEach((el) => el.removeAttribute(RGS_THEME_ATTR))
  }
  const target = container || document.documentElement
  target.setAttribute(RGS_THEME_ATTR, theme)
}
