<template>
  <div :class="['todo-item', { finished: data.finished }]">
    <!-- 完成状态圆形按钮 -->
    <div
      class="checkbox"
      :class="{ checked: data.finished }"
      :title="data.finished ? '标记为未完成' : '标记为已完成'"
      @click="$emit('toggle', data.id)"
    >
      <svg v-if="data.finished" viewBox="0 0 24 24" width="11" height="11">
        <path
          fill="currentColor"
          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
        />
      </svg>
    </div>

    <!-- 内容（双击编辑） -->
    <div class="content" @dblclick="startEdit" title="双击编辑">
      <input
        v-if="isEditing"
        ref="editInputRef"
        v-model="editContent"
        class="edit-input"
        @blur="finishEdit"
        @keyup.enter="finishEdit"
        @keyup.escape="cancelEdit"
      />
      <span v-else class="text">{{ data.content }}</span>
    </div>

    <!-- 删除按钮 -->
    <button
      class="delete-btn"
      title="删除"
      @click="$emit('delete', data.id)"
    >
      <svg viewBox="0 0 24 24" width="14" height="14">
        <path
          fill="currentColor"
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { TodoItem } from '../../../composables/useTodos'

const props = defineProps<{
  data: TodoItem
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  edit: [id: string, content: string]
}>()

const isEditing = ref(false)
const editContent = ref('')
const editInputRef = ref<HTMLInputElement | null>(null)

function startEdit() {
  isEditing.value = true
  editContent.value = props.data.content
  nextTick(() => {
    editInputRef.value?.focus()
    editInputRef.value?.select()
  })
}

function finishEdit() {
  if (!isEditing.value) return
  const trimmed = editContent.value.trim()
  if (trimmed && trimmed !== props.data.content) {
    emit('edit', props.data.id, trimmed)
  }
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>

<style scoped lang="scss">
.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: all 0.25s ease;
  user-select: none;

  &:hover {
    box-shadow: var(--shadow-hover);
    border-color: var(--border-hover);
  }

  &.finished {
    opacity: 0.55;

    .text {
      text-decoration: line-through;
      color: var(--text-disabled);
    }

    &:hover { opacity: 0.8; }
  }
}

.checkbox {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  color: #fff;

  svg { width: 11px; height: 11px; }

  &:hover {
    border-color: var(--accent);
    background: var(--accent-light);
  }

  &.checked {
    background: var(--success);
    border-color: var(--success);

    &:hover {
      background: var(--success-hover);
      border-color: var(--success-hover);
    }
  }
}

.content {
  flex: 1;
  min-width: 0;
  cursor: default;

  .text {
    font-size: 15px;
    color: var(--text-primary);
    word-break: break-word;
    line-height: 1.6;
    transition: color 0.3s;
  }

  .edit-input {
    width: 100%;
    height: 28px;
    padding: 0 8px;
    border: 1.5px solid var(--accent);
    border-radius: 6px;
    font-size: 15px;
    outline: none;
    background: var(--accent-bg);
    color: var(--text-primary);
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--accent-hover);
    }
  }
}

.delete-btn {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;

  &:hover {
    color: var(--danger);
    background: var(--danger-hover);
  }
}
</style>
