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
| `'input'` | Text input |
| `'select'` | Text input |
| `'combo'` | Text input |
| `'checkbox'` | Text input |
| `'datePicker'` | Text input |
| `'multiselect'` | Text input |

::: warning
Every `editorType` value currently renders the same text input — setting the
property marks the column editable, but does not yet select a widget. For a
real dropdown, date picker or checkbox, use [`editTemplate`](#custom-editors).
:::

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

## Custom editors

`editTemplate` renders any React node as the cell's editor. A column with
`editTemplate` is editable — `editorType` is not required.

```tsx
editTemplate?: (
  value: unknown,
  row: T,
  column: GridColumn<T>,
  api: GridCellEditorApi,
) => ReactNode
```

The first three arguments match `template` and `tooltipTemplate`. The `api`
object drives the edit lifecycle:

| Member | Purpose |
|---|---|
| `api.onChange(value)` | Stage a value without closing the editor |
| `api.onCommit(value?)` | Commit and close; an explicit value wins over the staged one |
| `api.onCancel()` | Revert to the original value and close |
| `api.ref` | Attach to the control that should receive focus |

### Committing in one gesture

For a control where picking a value *is* the edit, commit directly. Passing the
value to `onCommit` avoids a stale read — `onChange` only schedules a state
update, so calling `onCommit()` straight after it would commit the previous
value.

```tsx
{
  id: 'status',
  header: [{ text: 'Status' }],
  editTemplate: (value, row, column, api) => (
    <select
      ref={api.ref as never}
      value={String(value)}
      onChange={(e) => api.onCommit(e.target.value)}
    >
      <option value="active">Active</option>
      <option value="archived">Archived</option>
    </select>
  ),
}
```

### Staging, then committing on Enter

For typed input, stage with `onChange` and let the grid's Enter handler commit.

```tsx
editTemplate: (value, row, column, api) => (
  <input
    ref={api.ref as never}
    value={String(value)}
    onChange={(e) => api.onChange(e.target.value)}
  />
)
```

### Keyboard opt-out

The grid handles **Enter** (commit), **Escape** (cancel) and **Tab** (commit and
move to the next editable cell). Call `stopPropagation()` on a key to take it
over — for a textarea where Enter should insert a newline:

```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter') e.stopPropagation()
}}
```

### Focus and blur

Attach `api.ref` to the control you want focused when editing opens. If no
template calls it, the grid focuses the editor's wrapper instead, so Escape and
click-outside still work.

Clicking between controls *inside* your editor does not commit; focus leaving
the editor entirely does.

::: warning
A template that portals content outside the cell — a dropdown menu rendered
into `document.body`, for example — falls outside that containment check. Such
editors should drive `api.onCommit` and `api.onCancel` themselves.
:::

### Committing `undefined`

`api.onCommit(undefined)` is treated as "no explicit value" and commits whatever
was staged. To store `undefined`, stage it first: `api.onChange(undefined)`,
then call `api.onCommit()` with no argument.

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
