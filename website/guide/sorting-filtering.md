# Sorting & Filtering

## Sorting

Enable sorting on individual columns or the entire grid:

```tsx
// All columns sortable
<Grid columns={columns} data={data} sortable />

// Per-column
const columns = [
  { id: 'name', header: [{ text: 'Name' }], sortable: true },
  { id: 'salary', header: [{ text: 'Salary' }], sortable: true },
]
```

Click a column header to sort ascending; click again for descending. Repeated clicks toggle between ascending and descending. Ctrl-click (or Cmd-click on macOS) adds or updates a secondary sort column.

### Sort events

```tsx
<Grid
  columns={columns}
  data={data}
  sortable
  onBeforeSort={(states) => {
    // states: { columnId: string, order: 'asc' | 'desc' }[]
    // return false to cancel
  }}
  onAfterSort={(states) => {
    console.log('sorted by', states)
  }}
/>
```

## Header filters

Add a filter row to a column by adding a second `header` cell with `content`:

```ts
const columns = [
  {
    id: 'name',
    header: [
      { text: 'Name' },
      { content: 'inputFilter' },   // free-text filter
    ],
  },
  {
    id: 'department',
    header: [
      { text: 'Department' },
      { content: 'selectFilter' },  // dropdown filter
    ],
  },
  {
    id: 'level',
    header: [
      { text: 'Level' },
      { content: 'comboFilter' },   // combo (type + select) filter
    ],
  },
]
```

Filters are AND-combined — rows must match all active filters to be shown.

## Footer aggregates

```ts
const columns = [
  {
    id: 'salary',
    header: [{ text: 'Salary' }],
    footer: [{ content: 'sum' }],
  },
]
```

Available aggregate functions: `'sum'`, `'avg'`, `'count'`, `'min'`, `'max'`.

Custom footer template:

```ts
footer: [{
  content: 'sum',
  template: (value) => `Total: $${value.toLocaleString()}`,
}]
```
