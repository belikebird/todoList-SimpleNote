declare module 'vuedraggable' {
  import type { DefineComponent } from 'vue'
  const draggable: DefineComponent<{
    list?: any[]
    modelValue?: any[]
    itemKey?: string | ((element: any) => string | number)
    handle?: string
    ghostClass?: string
    chosenClass?: string
    dragClass?: string
    animation?: number | string
    group?: string | { name?: string; pull?: boolean | 'clone'; put?: boolean | string[] }
    disabled?: boolean
    move?: (params: {
      draggedElement: any
      draggedContext: any
      relatedContext: any
      to: string
    }) => boolean
    clone?: (element: any) => any
    tag?: string
    [key: string]: any
  }>
  export default draggable
}
