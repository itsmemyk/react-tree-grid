/** All design token keys. Values map to CSS custom properties as --react-tree-grid-{key-in-kebab-case}. */
export interface ThemeTokens {
  colorPrimary: string
  colorPrimaryHover: string
  colorSecondary: string
  colorDanger: string
  colorSuccess: string
  colorWarning: string
  colorBackground: string
  colorSurface: string
  colorText: string
  colorTextSecondary: string
  colorBorder: string

  fontFamily: string
  fontSizeSm: string
  fontSizeMd: string
  fontSizeLg: string
  fontWeightNormal: string
  fontWeightMedium: string
  fontWeightBold: string

  spacingXs: string
  spacingSm: string
  spacingMd: string
  spacingLg: string
  spacingXl: string

  radiusSm: string
  radiusMd: string
  radiusLg: string

  shadowSm: string
  shadowMd: string
  shadowLg: string

  zIndexDropdown: string
  zIndexModal: string
  zIndexPopup: string
  zIndexTooltip: string
}

/** Convert a camelCase token key to a CSS custom property name: colorPrimary → --react-tree-grid-color-primary */
export function tokenToCssVar(key: string): string {
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase()
  return `--react-tree-grid-${kebab}`
}

/** Convert a full token set into a CSS variable style object */
export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(tokens)) {
    vars[tokenToCssVar(key)] = value
  }
  return vars
}
