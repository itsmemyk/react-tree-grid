# Selection

Grid and TreeGrid support four selection modes via the `selection` prop.

## Modes

| Value | Behaviour |
|---|---|
| `false` (default) | No selection |
| `true` or `'row'` | Click selects the whole row |
| `'cell'` | Click selects a single cell |
| `'complex'` | Row selected; Shift+click extends range |

```tsx
<Grid columns={columns} data={data} selection="row" />
```

## Multi-selection

Add `multiselection` to allow selecting multiple rows or cells:

```tsx
<Grid
  columns={columns}
  data={data}
  selection="row"
  multiselection
/>
```

Hold **Ctrl/Cmd** and click to add rows; hold **Shift** and click for range selection.

## Selection events

```tsx
<Grid
  columns={columns}
  data={data}
  selection="cell"
  onBeforeSelect={(rowId, colId) => {
    // return false to cancel
  }}
  onAfterSelect={(rowId, colId) => {
    console.log('selected', rowId, colId)
  }}
  onBeforeUnSelect={(rowId, colId) => {}}
  onAfterUnSelect={(rowId, colId) => {}}
  onCellClick={(rowId, colId, event) => {}}
  onCellDblClick={(rowId, colId, event) => {}}
/>
```

## Tree selection

`Tree` uses `selected` (controlled) and `onSelect`:

```tsx
const [selected, setSelected] = useState<string[]>([])

<Tree
  data={data}
  selected={selected}
  onSelect={(id) => setSelected([id])}
/>
```
