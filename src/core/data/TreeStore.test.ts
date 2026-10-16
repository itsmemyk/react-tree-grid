import { describe, it, expect } from 'vitest'
import { TreeStore } from './TreeStore'

describe('TreeStore filter order', () => {
  it('keeps parents (kept for a matching descendant) in their original position', () => {
    const store = new TreeStore({ rootId: 'root' })
    store.add([
      { id: 'p1', name: 'apple' },
      { id: 'p2', name: 'folder' },
      { id: 'p3', name: 'apricot' },
    ])
    store.add({ id: 'c1', name: 'apple pie' }, -1, 'p2')
    store.add({ id: 'c2', name: 'banana' }, -1, 'p2')

    store.filter({ by: 'name', match: 'ap' })
    expect(store.getItems('root').map((x) => x.id)).toEqual(['p1', 'p2', 'p3'])
    expect(store.getItems('p2').map((x) => x.id)).toEqual(['c1'])
  })

  it('preserves order for deeper chains', () => {
    const store = new TreeStore({ rootId: 'root' })
    store.add([{ id: 'a', name: 'x' }, { id: 'b', name: 'match' }])
    store.add([{ id: 'a1', name: 'x' }, { id: 'a2', name: 'match' }], -1, 'a')
    store.add({ id: 'a1x', name: 'match' }, -1, 'a1')
    store.filter({ by: 'name', match: 'match' })
    expect(store.getItems('root').map((x) => x.id)).toEqual(['a', 'b'])
    expect(store.getItems('a').map((x) => x.id)).toEqual(['a1', 'a2'])
    expect(store.getItems('a1').map((x) => x.id)).toEqual(['a1x'])
  })
})
