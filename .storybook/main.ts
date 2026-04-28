import type { StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(config) {
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@core': resolve(__dirname, '../src/core'),
    }
    return config
  },
}

export default config
