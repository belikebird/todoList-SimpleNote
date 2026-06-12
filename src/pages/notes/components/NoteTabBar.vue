<script setup lang="ts">
import type { NoteItem } from '../../../composables/useNotes'
import { getNoteTitle, NOTE_COLOR_MAP } from '../../../composables/useNotes'

defineProps<{
  notes: NoteItem[]
  selectedNoteId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
  close: [id: string]
  add: []
}>()

// 防止关闭事件冒泡到 select
function handleClose(event: Event, id: string) {
  event.stopPropagation()
  emit('close', id)
}
</script>

<template>
  <div class="note-tab-bar">
    <div class="tab-list">
      <div
        v-for="note in notes"
        :key="note.id"
        :class="['note-tab', { active: note.id === selectedNoteId }]"
        :style="{ '--tab-color': NOTE_COLOR_MAP[note.color] }"
        @click="emit('select', note.id)"
      >
        <span class="tab-title">{{ getNoteTitle(note.content, 12) }}</span>
        <button class="tab-close" @click="handleClose($event, note.id)">
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>
    </div>

    <button class="tab-add" @click="emit('add')" title="新建便签 (Ctrl+N)">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path
          fill="currentColor"
          d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.note-tab-bar {
  display: flex;
  align-items: center;
  gap: 0;
  height: 42px;
  min-height: 42px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  padding-right: 8px;
  flex-shrink: 0;
}

.tab-list {
  display: flex;
  align-items: stretch;
  gap: 2px;
  overflow-x: auto;
  flex: 1;
  padding: 4px 4px 4px 8px;

  &::-webkit-scrollbar {
    height: 3px;
  }
}

.note-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  min-width: 80px;
  max-width: 160px;
  border-radius: 8px 8px 0 0;
  background: var(--tab-color);
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
  position: relative;
  user-select: none;
  border: 1.5px solid transparent;

  &:hover {
    filter: brightness(0.96);
  }

  &.active {
    box-shadow: 0 -2px 6px color-mix(in srgb, var(--tab-color) 40%, transparent);
    border-color: color-mix(in srgb, var(--tab-color) 60%, transparent);
    border-bottom-color: transparent;
    z-index: 1;
  }
}

.tab-title {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.tab-close {
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
    color: rgba(0, 0, 0, 0.7);
  }
}

.tab-add {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  margin-left: 4px;

  &:hover {
    background: var(--accent-light);
    color: var(--accent);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
