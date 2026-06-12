import { ref, watch, type Ref } from 'vue'

export interface TodoItem {
  id: string
  content: string
  finished: boolean
  createdAt: number
}

// ─── 模块级单例状态 ───
const todoItems: Ref<TodoItem[]> = ref([])

let initialized = false
let saveTimer: ReturnType<typeof setTimeout> | null = null

/** 防抖保存（300ms） */
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    try {
      await window.ipcRenderer.invoke('save-todos', JSON.stringify(todoItems.value))
    } catch (e) {
      console.error('Save failed:', e)
    }
  }, 300)
}

// 监听变化，自动持久化
watch(todoItems, () => {
  if (initialized) scheduleSave()
}, { deep: true })

export function useTodos() {
  /** 从本地文件加载 todo 列表 */
  async function loadTodos() {
    try {
      const raw = await window.ipcRenderer.invoke('load-todos')
      if (raw) {
        const parsed = JSON.parse(raw) as TodoItem[]
        if (Array.isArray(parsed)) {
          todoItems.value = parsed
        }
      }
    } catch (e) {
      console.error('Load failed:', e)
    }
    initialized = true
  }

  /** 添加一条新待办 */
  function addTodo(content: string) {
    const text = content.trim()
    if (!text) return
    todoItems.value.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      content: text,
      finished: false,
      createdAt: Date.now(),
    })
  }

  /** 删除指定待办 */
  function deleteTodo(id: string) {
    const idx = todoItems.value.findIndex((t) => t.id === id)
    if (idx !== -1) todoItems.value.splice(idx, 1)
  }

  /** 切换完成/未完成状态 */
  function toggleTodo(id: string) {
    const item = todoItems.value.find((t) => t.id === id)
    if (item) item.finished = !item.finished
  }

  /** 编辑待办内容 */
  function editTodo(id: string, content: string) {
    const item = todoItems.value.find((t) => t.id === id)
    if (item) item.content = content
  }

  return { todoItems, addTodo, deleteTodo, toggleTodo, editTodo, loadTodos }
}
