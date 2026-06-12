<script setup lang="ts">
import { computed } from 'vue'
import type { NoteItem } from '../../../composables/useNotes'
import { getNoteTitle, getRelativeTime, NOTE_COLOR_MAP } from '../../../composables/useNotes'

const props = defineProps<{
  notes: NoteItem[]
  selectedNoteId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

// 按 updatedAt 降序排列
const sortedNotes = computed(() =>
  [...props.notes].sort((a, b) => b.updatedAt - a.updatedAt),
)
</script>

<template>
  <div class="note-sidebar">
    <div class="sidebar-header">
      <span class="sidebar-title">历史便签</span>
      <span class="sidebar-count">{{ notes.length }}</span>
    </div>

    <div class="sidebar-list">
      <!-- 空列表 -->
      <div v-if="notes.length === 0" class="sidebar-empty">
        <p>暂无便签</p>
        <p class="empty-hint">点击 + 创建</p>
      </div>

      <!-- 便签列表项 -->
      <div
        v-for="note in sortedNotes"
        :key="note.id"
        :class="['sidebar-item', { active: note.id === selectedNoteId }]"
        @click="emit('select', note.id)"
      >
        <span class="note-dot" :style="{ background: NOTE_COLOR_MAP[note.color] }" />
        <div class="note-preview">
          <p class="note-title">{{ getNoteTitle(note.content) }}</p>
          <p class="note-time">{{ getRelativeTime(note.updatedAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.note-sidebar {
  width: 220px;
  min-width: 220px;
  max-width: 220px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.sidebar-count {
  font-size: 11px;
  color: var(--text-disabled);
  background: var(--bg-surface-hover);
  padding: 2px 8px;
  border-radius: 10px;
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 6px 8px;
}

.sidebar-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 12px;
  color: var(--text-disabled);
  user-select: none;

  p {
    margin: 2px 0;
    font-size: 13px;
  }

  .empty-hint {
    font-size: 12px;
  }
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 2px;

  &:hover {
    background: var(--bg-surface-hover);
  }

  &.active {
    background: var(--accent-light);
  }
}

.note-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--text-disabled) 30%, transparent);
}

.note-preview {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.note-title {
  margin: 0;
  font-size: 13px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.note-time {
  margin: 3px 0 0;
  font-size: 11px;
  color: var(--text-disabled);
}
</style>
