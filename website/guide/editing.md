# Inline Editing

Enable inline editing with `editable` on the grid:

```tsx
<Grid columns={columns} data={data} editable />
```

Double-click a cell to enter edit mode. Press **Enter** or click outside to confirm; press **Escape** to cancel.

## Editor types

Set `editorType` on the column to control the input widget:

| Value | Widget |
|---|---|
| `'input'` | Text input (default) |
| `'select'` | Native `<select>` dropdown |
| `'combo'` | Searchable combobox |
| `'checkbox'` | Toggle checkbox |
| `'datePicker'` | Date picker |
| `'multiselect'` | Multi-value select |

```ts
const columns = [
  { id: 'name', header: [{ text: 'Name' }], editorType: 'input' },
  {
    id: 'status',
    header: [{ text: 'Status' }],
    editorType: 'select',
    // options come from unique values in the data column
  },
]
```

## Edit events

```tsx
<Grid
  columns={columns}
  data={data}
  editable
  onBeforeEditStart={(rowId, colId) => {
    // return false to prevent editing this cell
  }}
  onAfterEditStart={(rowId, colId) => {}}
  onBeforeEditEnd={(rowId, colId, newValue, oldValue) => {
    // return false to reject the new value
    if (newValue === '') return false
  }}
  onAfterEditEnd={(rowId, colId, newValue) => {
    // persist the change
    updateRow(rowId, colId, newValue)
  }}
/>
```

## Tree editing

`Tree` supports editing node labels with the `editable` prop:

```tsx
<Tree
  data={data}
  editable
  onEdit={(id, newValue) => {
    updateNode(id, newValue)
  }}
/>
```

Double-click a label to edit it.
