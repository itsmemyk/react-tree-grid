# Virtual Scrolling

Virtual scrolling renders only the rows currently visible in the viewport, making it possible to display 100,000+ rows without degrading performance.

## Enabling virtual scroll

Provide explicit `width` and `height` dimensions via the `style` prop:

```tsx
<Grid
  columns={columns}
  data={largeDataset}
  style={{ width: 800, height: 600 }}
/>
```

Without `style.height`, the grid expands to fit all rows — no virtual scrolling occurs.

## Row height

The default row height is `34px`. You can override it per-grid:

```tsx
<Grid
  columns={columns}
  data={data}
  rowHeight={44}
  style={{ width: 800, height: 600 }}
/>
```

Or per-row via the `$height` reserved field:

```ts
const data = [
  { id: '1', name: 'Alice', $height: 64 },
  { id: '2', name: 'Bob' },  // uses default rowHeight
]
```

## Auto row height

Set `autoHeight` to wrap rows to their tallest cell's content:

```tsx
<Grid columns={columns} data={data} autoHeight style={{ width: 800, height: 600 }} />
```

::: warning
`autoHeight` measures DOM nodes and may reduce scroll performance on very large datasets.
:::

## Scroll events

```tsx
<Grid
  columns={columns}
  data={data}
  style={{ width: 800, height: 600 }}
  onScroll={({ x, y }) => {
    console.log('scroll position', x, y)
  }}
/>
```
