<script setup lang="ts">
import { computed } from "vue";
import type { NoteItem } from "../../../composables/useNotes";
import {
  getNoteTitle,
  getRelativeTime,
  NOTE_COLOR_MAP,
} from "../../../composables/useNotes";

const props = defineProps<{
  notes: NoteItem[];
  showNotesId: string[];
}>();

const emit = defineEmits<{
  add: [];
  delete: [id: string];
  addShowNote: [id: string];
  removeShowNote: [id: string];
}>();

// 按 updatedAt 降序排列
const sortedNotes = computed(() =>
  [...props.notes].sort((a, b) => b.updatedAt - a.updatedAt),
);

// 处理便签点击事件：移除/增加TabBar展示Note
function handleClick(id: string) {
  const isInShowNotes = props.showNotesId.some((noteId) => noteId == id);
  isInShowNotes ? emit("removeShowNote", id) : emit("addShowNote", id);
}
</script>

<template>
  <div class="note-sidebar">
    <!-- 顶部-历史便签 -->
    <div class="sidebar-header">
      <span class="sidebar-title">历史便签</span>
      <button
        class="sidebar-add"
        @click="emit('add')"
        title="新建便签 (Ctrl+N)"
      >
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>
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
        :class="['sidebar-item', { active: showNotesId.includes(note.id) }]"
        @click="handleClick(note.id)"
      >
        <span
          class="note-dot"
          :style="{ background: NOTE_COLOR_MAP[note.color] }"
        />
        <div class="note-preview">
          <p class="note-title">{{ getNoteTitle(note.content) }}</p>
          <p class="note-time">{{ getRelativeTime(note.updatedAt) }}</p>
        </div>
        <!-- 删除便签按钮 -->
        <button @click.stop="emit('delete', note.id)" class="delete-btn">
          <svg
            t="1781310567117"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1659"
            width="200"
            height="200"
          >
            <path
              d="M512 557.223994l249.203712 249.203712c12.491499 12.491499 32.730449 12.489452 45.221948-0.002047s12.493545-32.730449 0.002047-45.221948L557.223994 512l249.203712-249.203712c12.491499-12.491499 12.489452-32.730449-0.002047-45.221948s-32.730449-12.493545-45.221948-0.002047L512 466.776006 262.796288 217.572294c-12.491499-12.491499-32.729425-12.490475-45.220924 0.001023-6.246261 6.246261-9.370415 14.429641-9.370415 22.610974s3.121084 16.365736 9.367345 22.610974L466.774983 512 217.572294 761.203712c-6.246261 6.246261-9.367345 14.428617-9.367345 22.610974s3.125177 16.365736 9.370415 22.610974c12.491499 12.491499 32.729425 12.493545 45.220924 0.002047L512 557.223994z"
              fill="#cecece"
              p-id="1660"
            ></path>
          </svg>
        </button>
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
  padding: 6px 15px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.sidebar-add {
  width: 30px;
  height: 30px;
  box-sizing: border-box;
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
  margin-bottom: 3px;
  border: 1px solid var(--border);

  &:hover {
    background: var(--bg-surface-hover);
    .delete-btn {
      opacity: 1;
    }
  }

  &.active {
    background: var(--bg-surface-hover);
    border-color: var(--border);
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
  color: var(--text-secondary);
}

.delete-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
  opacity: 0;

  svg {
    width: fit-content;
    height: fit-content;
  }

  &:hover {
    & svg path {
      fill: var(--danger);
    }
  }
}
</style>
