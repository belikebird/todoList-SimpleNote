<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useNotes, type NoteItem } from "../../composables/useNotes";
import NoteTabBar from "./components/NoteTabBar.vue";
import NoteSidebar from "./components/NoteSidebar.vue";
import NoteEditor from "./components/NoteEditor.vue";

const {
  notes,
  showNotesId,
  addNote,
  deleteNote,
  updateNoteContent,
  setNoteColor,
  loadNotes,
  addShowNote,
  removeShowNote,
  loadShowNotes
} = useNotes();

const selectedNoteId = ref<string | null>(null);

// 当前选中的便签
const selectedNote = computed<NoteItem | null>(() => {
  if (!selectedNoteId.value) return null;
  return notes.value.find((n) => n.id === selectedNoteId.value) ?? null;
});

// ─── 选择便签 ───
function selectNote(id: string) {
  selectedNoteId.value = id;
}

// ─── 新建便签 ───
function handleAdd() {
  const newNote = addNote();
  selectedNoteId.value = newNote.id;
  showNotesId.value.push(newNote.id);
}

function handleDelete(id: string) {
  if (!notes.value.some(note => note.id == id)) return
  deleteNote(id);
}

// ─── 移除展示的便签 ───
function handleClose(id: string) {
  const idx = showNotesId.value.findIndex((noteId) => noteId === id);
  removeShowNote(id);

  // 智能切换：如果删除的是当前选中，优先选后一个，否则前一个，否则 null
  if (selectedNoteId.value === id) {
    if (showNotesId.value.length === 0) {
      selectedNoteId.value = null;
    } else {
      // 优先选后一个（idx 是删除前的位置）
      const targetId = showNotesId.value[Math.min(idx, showNotesId.value.length - 1)]
      const nextNote = notes.value.find(note => note.id == targetId);
      selectedNoteId.value = nextNote?.id ?? null;
    }
  }
}

// ─── 添加TabBar显示的便签 ───
function handleAddShowNote(id: string) {
  addShowNote(id)
  selectedNoteId.value = id;
}

// ─── 移除TabBar显示的便签 ───
function handleRemoveShowNote(id: string) {
  removeShowNote(id)
}

// ─── 更新内容 ───
function handleUpdate(id: string, content: string) {
  updateNoteContent(id, content);
}

// ─── 更改颜色 ───
function handleColorChange(id: string, color: NoteItem["color"]) {
  setNoteColor(id, color);
}

// ─── 快捷键 Ctrl+N 新建 ───
function handleKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === "n") {
    event.preventDefault();
    handleAdd();
  }
}

// ─── 生命周期 ───
onMounted(async () => {
  await loadNotes();
  await loadShowNotes();
  if (notes.value.length > 0) {
    selectedNoteId.value = notes.value[0].id;
  }
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="notes-page">
    <!-- 顶部 Tab 栏 -->
    <NoteTabBar
      :notes="notes"
      :selected-note-id="selectedNoteId"
      :show-notes-id="showNotesId"
      @select="selectNote"
      @closeShowNote="handleClose"
    />

    <!-- 主内容区：侧边栏 + 编辑器 -->
    <div class="notes-content">
      <NoteSidebar
        :notes="notes"
        :show-notes-id="showNotesId"
        @add="handleAdd"
        @delete="handleDelete"
        @add-show-note="handleAddShowNote"
        @remove-show-note="handleRemoveShowNote"
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
