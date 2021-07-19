import { ReactNode } from 'react'

export interface BaseItemType {
  /**
   * Unique identificator of item. If not present, new one will be generated.
   */
  id?: string

  children?: BaseItemType[]
}

export interface ReactTreeListItemType extends BaseItemType {
  /**
   * Text or custom component to be rendered as label/content of item
   */
  label?: ReactNode

  /**
   * TODO:
   */
  children?: ReactTreeListItemType[]

  /**
   * Defines whether `children` should be displayed on screen
   *
   * Default: `false`
   */
  open?: boolean

  /**
   * Custom component that'll be rendered as an icon
   */
  icon?: ReactNode

  /**
   * Custom component that'll be rendered as an arrow
   *
   * Default: `"▸"`
   */
  arrow?: ReactNode

  /**
   * Defines whether children can or cannot be passed into the item. If `false`, this element also
   * removes all current children. If you want to disallow only additional children but keep the
   * current, use `allowDropInside: false` instead.
   *
   * Default: `true`
   */
  allowChildren?: boolean

  /**
   * Defines whether content can be dropped inside an item. Children are still allowed, it's just
   * impossible to drop any more children inside.
   *
   * Default: `true`
   */
  allowDropInside?: boolean

  /**
   * Defines whether content can be dropped inside. Also adds a visual cue that the item is disabled.
   *
   * Default: `false`
   */
  disabled?: boolean

  /**
   * initial form data
   *
   */
  data?: object

  /**
   * Schema used by the form
   *
   */
  schema?: object

  /**
   * Schema type
   *
   */
  type?: string
}
