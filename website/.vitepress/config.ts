import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/react-tree-grid/docs/',
  title: 'React TreeGrid',
  description: 'High-performance Grid, Tree & TreeGrid for React 18+. Zero dependencies.',
  head: [['link', { rel: 'icon', href: '/react-tree-grid/docs/favicon.ico' }]],

  themeConfig: {
    logo: null,
    siteTitle: 'React TreeGrid',

    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      { text: 'API', link: '/api/grid', activeMatch: '/api/' },
      { text: 'Examples', link: '/examples/grid-basic', activeMatch: '/examples/' },
      {
        text: 'v0.5.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/itsmemyk/react-tree-grid/blob/master/CHANGELOG.md' },
          { text: 'npm', link: 'https://www.npmjs.com/package/@itsmemyk/react-tree-grid' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is react-tree-grid?', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'ThemeProvider & Theming', link: '/guide/theming' },
            { text: 'Column Definitions', link: '/guide/columns' },
            { text: 'Data & Row Types', link: '/guide/data-row-types' },
            { text: 'Selection', link: '/guide/selection' },
            { text: 'Sorting & Filtering', link: '/guide/sorting-filtering' },
            { text: 'Editing', link: '/guide/editing' },
            { text: 'Virtual Scrolling', link: '/guide/virtual-scrolling' },
          ],
        },
        {
          text: 'Migration',
          items: [
            { text: 'From DHTMLX TreeGrid', link: '/guide/migration-dhtmlx' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'Components',
          items: [
            { text: 'Grid', link: '/api/grid' },
            { text: 'Tree', link: '/api/tree' },
            { text: 'TreeGrid', link: '/api/treegrid' },
            { text: 'ThemeProvider', link: '/api/theme-provider' },
          ],
        },
        {
          text: 'Types',
          items: [
            { text: 'Shared Types', link: '/api/types' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Grid',
          items: [
            { text: 'Basic Grid', link: '/examples/grid-basic' },
            { text: 'Sortable & Filterable', link: '/examples/grid-sortable-filterable' },
            { text: 'Inline Editing', link: '/examples/grid-inline-editing' },
            { text: 'Frozen Columns', link: '/examples/grid-frozen-columns' },
            { text: 'Custom Cell Renderer', link: '/examples/grid-custom-cell' },
          ],
        },
        {
          text: 'Tree',
          items: [
            { text: 'Basic Tree', link: '/examples/tree-basic' },
            { text: 'Checkboxes & Drag', link: '/examples/tree-checkboxes-drag' },
          ],
        },
        {
          text: 'TreeGrid',
          items: [
            { text: 'Basic TreeGrid', link: '/examples/treegrid-basic' },
            { text: 'DHTMLX Showcase', link: '/examples/treegrid-showcase' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/itsmemyk/react-tree-grid' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@itsmemyk/react-tree-grid' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Mayank Mahadevwala',
    },

    search: {
      provider: 'local',
    },

    editLink: undefined,
  },
})
