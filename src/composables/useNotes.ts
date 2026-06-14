import { ref, watch, type Ref } from 'vue'

export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'orange'

export interface NoteItem {
  id: string
  content: string
  color: NoteColor
  createdAt: number
  updatedAt: number
}
export type ShowNoteItems = string[];

export const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange']
export const DEFAULT_NOTE_COLOR: NoteColor = 'yellow'
export const NOTE_COLOR_MAP: Record<NoteColor, string> = {
  yellow: '#fff9c4',
  pink: '#f8bbd0',
  blue: '#bbdefb',
  green: '#c8e6c9',
  purple: '#e1bee7',
  orange: '#ffe0b2',
}

/** 从便签内容提取标题（首行，截断到 maxLen） */
export function getNoteTitle(content: string, maxLen = 20): string {
  const firstLine = content.split('\n')[0]?.trim()
  if (!firstLine) return '未命名便签'
  return firstLine.length > maxLen ? firstLine.slice(0, maxLen) + '…' : firstLine
}

/** 生成相对时间描述 */
export function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// ─── 模块级单例状态 ───
const notes: Ref<NoteItem[]> = ref([])
const showNotesId: Ref<string[]> = ref([])

let initialized = false
let saveTimer: ReturnType<typeof setTimeout> | null = null

/** 防抖保存（300ms） */
function scheduleSave() {

  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    try {
      await window.ipcRenderer.invoke('save-notes', JSON.stringify(notes.value))
    } catch (e) {
      console.error('Save notes failed:', e)
    }
  }, 300)
}

function scheduleShowSave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    try {
      await window.ipcRenderer.invoke('save-show-notesId', JSON.stringify(showNotesId.value))
    } catch (e) {
      console.error('Save notes failed:', e)
    }
  }, 300)
}


// 监听变化，自动持久化
watch(notes, () => {
  if (initialized) scheduleSave()
}, { deep: true })

watch(showNotesId, () => {
  if (initialized) scheduleShowSave()
}, { deep: true })

export function useNotes() {
  /** 从本地文件加载便签列表 */
  async function loadNotes() {
    try {
      const raw = await window.ipcRenderer.invoke('load-notes')
      if (raw) {
        const parsed = JSON.parse(raw) as NoteItem[]
        if (Array.isArray(parsed)) {
          notes.value = parsed
        }
      }
    } catch (e) {
      console.error('Load notes failed:', e)
    }
    initialized = true
  }

  /** 创建一条新便签并返回 */
  function addNote(): NoteItem {
    const note: NoteItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      content: '',
      color: DEFAULT_NOTE_COLOR,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    notes.value.push(note)
    return note
  }

  /** 删除指定便签 */
  function deleteNote(id: string) {
    const idx = notes.value.findIndex((n) => n.id === id)
    if (idx !== -1) notes.value.splice(idx, 1)
    console.log('Deleted note', id)
  }

  /** 更新便签内容 */
  function updateNoteContent(id: string, content: string) {
    const note = notes.value.find((n) => n.id === id)
    if (note) {
      note.content = content
      note.updatedAt = Date.now()
    }
  }

  /** 设置便签颜色 */
  function setNoteColor(id: string, color: NoteColor) {
    const note = notes.value.find((n) => n.id === id)
    if (note) {
      note.color = color
      note.updatedAt = Date.now()
    }
  }

  /** 从本地文件中加载上次在TabBar展示的便签 */
  async function loadShowNotes() {
    try {
      const raw = await window.ipcRenderer.invoke('load-show-notesId')
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        if (Array.isArray(parsed)) {
          showNotesId.value = parsed
        }
      } else {
        // 确保在加载完 notes 后再设置默认值
        if (notes.value.length > 0) {
          showNotesId.value = [notes.value[0].id]
        } else {
          showNotesId.value = []
        }
      }
    } catch (e) {
      console.error('Load show notes failed:', e)
    }
  }

  /** 增加TabBar展示的便签 */
  function addShowNote(id: string) {
    if (!showNotesId.value.includes(id)) {
      showNotesId.value.push(id)
    }
  }

  /** 移除TabBar展示的便签 */
  function removeShowNote(id: string) {
    const idx = showNotesId.value.findIndex((n) => n === id)
    if (idx !== -1) showNotesId.value.splice(idx, 1)
  }

  return {
    notes,
    showNotesId,
    addNote,
    deleteNote,
    updateNoteContent,
    setNoteColor,
    loadNotes,
    loadShowNotes,
    addShowNote,
    removeShowNote,
  }
}
