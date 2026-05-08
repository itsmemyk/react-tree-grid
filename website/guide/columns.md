# Column Definitions

Columns are defined as an array of `GridColumn` objects passed to the `columns` prop of `Grid` or `TreeGrid`.

## Minimal column

```ts
const columns: GridColumn[] = [
  { id: 'name', header: [{ text: 'Name' }] },
]
```

`id` must match a key in your row data. `header` is an array of header cells — most columns have one, but you can stack multiple rows.

## Width

```ts
{ id: 'name', header: [{ text: 'Name' }], width: 200 }
{ id: 'name', header: [{ text: 'Name' }], minWidth: 100, maxWidth: 400 }
```

Omitting `width` distributes remaining space among flexible columns when `autoWidth` is set on the grid.

## Column types

The `type` field controls how cell values are rendered and sorted:

| Value | Rendering |
|---|---|
| `'string'` | Plain text (default) |
| `'number'` | Right-aligned number |
| `'date'` | Date string |
| `'boolean'` | Checkbox icon |
| `'select'` | Value from options list |
| `'checkbox'` | Checkbox cell |

## Custom cell renderer

Use `template` for full control over cell content:

```tsx
{
  id: 'status',
  header: [{ text: 'Status' }],
  width: 120,
  template: (value) => (
    <span style={{ color: value === 'active' ? 'green' : 'red' }}>
      {String(value)}
    </span>
  ),
}
```

## Sorting

```ts
{ id: 'name', header: [{ text: 'Name' }], sortable: true }
```

Or enable sorting for all columns at once via `sortable` on the grid.

## Header filters

Add a filter row to a column by including a second header cell with `content`:

```ts
{
  id: 'name',
  header: [
    { text: 'Name' },
    { content: 'inputFilter' },
  ],
}
```

Available filter types: `'inputFilter'`, `'selectFilter'`, `'comboFilter'`.

## Footer aggregates

```ts
{
  id: 'salary',
  header: [{ text: 'Salary' }],
  footer: [{ content: 'sum' }],
}
```

Available: `'sum'`, `'avg'`, `'count'`, `'min'`, `'max'`.

## Hiding columns

```ts
{ id: 'internal', hidden: true }
```

Or programmatically via the `GridApi`:

```ts
gridRef.current?.hideColumn('internal')
gridRef.current?.showColumn('internal')
```

## Resizing & reordering

```ts
{ id: 'name', resizable: true }
```

Column drag-reorder is enabled via the `dragItem="column"` prop on the grid.
