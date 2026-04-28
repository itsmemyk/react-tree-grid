/** Selection configuration */
export interface SelectionConfig {
  /** Enable/disable selection */
  disabled?: boolean
  /**
   * Multi-selection mode:
   * - false: single select only
   * - true/'click': multi-select on every click
   * - 'ctrlClick': multi-select only with Ctrl held
   */
  multiselection?: boolean | 'click' | 'ctrlClick'
}

/** Selection events */
export enum SelectionEvents {
  beforeSelect = 'beforeselect',
  afterSelect = 'afterselect',
  beforeUnSelect = 'beforeunselect',
  afterUnSelect = 'afterunselect',
}
