<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useNotes, type NoteItem } from '../../composables/useNotes'
import NoteTabBar from './components/NoteTabBar.vue'
import NoteSidebar from './components/NoteSidebar.vue'
import NoteEditor from './components/NoteEditor.vue'

const { notes, addNote, deleteNote, updateNoteContent, setNoteColor, loadNotes } = useNotes()

const selectedNoteId = ref<string | null>(null)

// 当前选中的便签
const selectedNote = computed<NoteItem | null>(() => {
  if (!selectedNoteId.value) return null
  return notes.value.find((n) => n.id === selectedNoteId.value) ?? null
})

// ─── 选择便签 ───
function selectNote(id: string) {
  selectedNoteId.value = id
}

// ─── 新建便签 ───
function handleAdd() {
  const newNote = addNote()
  selectedNoteId.value = newNote.id
}

// ─── 删除便签 ───
function handleClose(id: string) {
  const idx = notes.value.findIndex((n) => n.id === id)
  deleteNote(id)

  // 智能切换：如果删除的是当前选中，优先选后一个，否则前一个，否则 null
  if (selectedNoteId.value === id) {
    if (notes.value.length === 0) {
      selectedNoteId.value = null
    } else {
      // 优先选后一个（idx 是删除前的位置）
      const next = notes.value[Math.min(idx, notes.value.length - 1)]
      selectedNoteId.value = next?.id ?? null
    }
  }
}

// ─── 更新内容 ───
function handleUpdate(id: string, content: string) {
  updateNoteContent(id, content)
}

// ─── 更改颜色 ───
function handleColorChange(id: string, color: NoteItem['color']) {
  setNoteColor(id, color)
}

// ─── 快捷键 Ctrl+N 新建 ───
function handleKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
    event.preventDefault()
    handleAdd()
  }
}

// ─── 生命周期 ───
onMounted(async () => {
  await loadNotes()
  if (notes.value.length > 0) {
    selectedNoteId.value = notes.value[0].id
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="notes-page">
    <!-- 顶部 Tab 栏 -->
    <NoteTabBar
      :notes="notes"
      :selected-note-id="selectedNoteId"
      @select="selectNote"
      @close="handleClose"
      @add="handleAdd"
    />

    <!-- 主内容区：侧边栏 + 编辑器 -->
    <div class="notes-content">
      <NoteSidebar
        :notes="notes"
        :selected-note-id="selectedNoteId"
        @select="selectNote"
      />
      <NoteEditor
        :note="selectedNote"
        @update="handleUpdate"
        @change-color="handleColorChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.notes-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-page);
  overflow: hidden;
  transition: background 0.3s;
}

.notes-content {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
}
</style>
