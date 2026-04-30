import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/core/theme'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals['theme'] ?? 'light'
      return (
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      )
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        showName: true,
      },
    },
  },
}

export default preview
