<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { NoteColor, NoteItem } from '../../../composables/useNotes'
import { NOTE_COLORS, NOTE_COLOR_MAP } from '../../../composables/useNotes'

const props = defineProps<{
  note: NoteItem | null
}>()

const emit = defineEmits<{
  update: [id: string, content: string]
  changeColor: [id: string, color: NoteColor]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 当前选中便签的颜色值（用于编辑器背景色调）
const noteBgColor = computed(() => {
  if (!props.note) return 'transparent'
  return NOTE_COLOR_MAP[props.note.color]
})

// 字数统计
const charCount = computed(() => props.note?.content.length ?? 0)

// 格式化最后更新时间
const lastUpdated = computed(() => {
  if (!props.note) return ''
  const diff = Date.now() - props.note.updatedAt
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  if (seconds < 60) return '刚刚保存'
  if (minutes < 60) return `${minutes}分钟前保存`
  if (hours < 24) return `${hours}小时前保存`
  const date = new Date(props.note.updatedAt)
  return `${date.getMonth() + 1}/${date.getDate()} 保存`
})

function handleInput(event: Event) {
  if (!props.note) return
  const target = event.target as HTMLTextAreaElement
  emit('update', props.note.id, target.value)
}

function handleColorChange(color: NoteColor) {
  if (!props.note) return
  emit('changeColor', props.note.id, color)
}

// 切换便签时自动聚焦
watch(
  () => props.note?.id,
  () => {
    nextTick(() => {
      textareaRef.value?.focus()
    })
  },
)
</script>

<template>
  <div class="note-editor">
    <!-- 无选中便签时 -->
    <div v-if="!note" class="editor-empty">
      <span class="empty-emoji">📝</span>
      <p>选择一个便签开始编辑</p>
      <p class="empty-hint">或在上方点击 + 创建新便签</p>
    </div>

    <!-- 编辑器 -->
    <div v-else class="editor-content" :style="{ '--note-bg': noteBgColor }">
      <!-- 颜色选择器 -->
      <div class="color-picker">
        <span class="color-label">颜色</span>
        <div class="color-options">
          <button
            v-for="c in NOTE_COLORS"
            :key="c"
            :class="['color-dot', { active: note.color === c }]"
            :style="{ '--dot-color': NOTE_COLOR_MAP[c] }"
            @click="handleColorChange(c)"
            :title="c"
          >
            <svg v-if="note.color === c" viewBox="0 0 24 24" width="10" height="10">
              <path fill="#333" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 文本编辑区 -->
      <textarea
        ref="textareaRef"
        :value="note.content"
        class="editor-textarea"
        placeholder="在此输入便签内容…"
        @input="handleInput"
      />

      <!-- 底部状态栏 -->
      <div class="editor-status">
        <span class="status-item">{{ charCount }} 字</span>
        <span class="status-item">{{ lastUpdated }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.note-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.editor-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-disabled);
  user-select: none;
  pointer-events: none;

  .empty-emoji {
    font-size: 48px;
    margin-bottom: 12px;
  }

  p {
    margin: 3px 0;
    font-size: 15px;
  }

  .empty-hint {
    font-size: 13px;
  }
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

// ─── 颜色选择器 ───
.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.color-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-right: 4px;
}

.color-options {
  display: flex;
  gap: 6px;
}

.color-dot {
  width: 22px;
  height: 22px;
  border: 2px solid var(--border);
  border-radius: 50%;
  background: var(--dot-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.15);
    border-color: var(--dot-color);
  }

  &.active {
    border-color: var(--dot-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--dot-color) 40%, transparent);
    transform: scale(1.1);
  }
}

// ─── 文本编辑区 ───
.editor-textarea {
  flex: 1;
  min-height: 0;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.7;
  font-family: inherit;
  color: var(--text-primary);
  background: transparent;
  white-space: pre-wrap;
  word-break: break-word;
  transition: background 0.2s;

  &::placeholder {
    color: var(--text-disabled);
  }
}

// ─── 底部状态栏 ───
.editor-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.status-item {
  font-size: 12px;
  color: var(--text-disabled);
}
</style>
