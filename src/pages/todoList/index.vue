<template>
  <div class="todo-page">
    <!-- 顶部：标题 + 统计 + 设置 -->
    <header class="header">
      <div class="header-main">
        <!-- <h1 class="title">今日待办</h1> -->
        <p class="subtitle">
          <span class="pending-label">{{ pendingCount }} 未完成</span>
          <span class="divider">·</span>
          <span class="finished-label">{{ finishedCount }} 已完成</span>
        </p>
        <ThemeModeVue />
      </div>
    </header>

    <!-- 列表区域 -->
    <div class="list-area">
      <div v-if="todoItems.length === 0" class="empty-state">
        <span class="empty-icon">🎯</span>
        <p>还没有待办事项</p>
        <p class="empty-hint">在下方输入，开始你的一天吧</p>
      </div>

      <draggable
        v-else
        :list="todoItems"
        item-key="id"
        ghost-class="drag-ghost"
        :animation="200"
        class="todo-list"
      >
        <template #item="{ element }">
          <TodoItemComp
            :data="element"
            @toggle="toggleTodo"
            @delete="deleteTodo"
            @edit="editTodo"
          />
        </template>
      </draggable>
    </div>

    <!-- 底部输入栏 -->
    <div class="input-bar">
      <input
        ref="inputRef"
        v-model="inputText"
        class="input-field"
        placeholder="输入新的待办事项，按回车添加…"
        @keyup.enter="handleAdd"
      />
      <button
        class="add-btn"
        :class="{ active: inputText.trim() }"
        :disabled="!inputText.trim()"
        @click="handleAdd"
      >
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeModeVue from "../../components/ThemeMode.vue";
import { ref, computed, watch, onMounted } from "vue";
import draggable from "vuedraggable";
import confetti from "canvas-confetti";
import TodoItemComp from "./components/todoItem.vue";
import { useTodos } from "../../composables/useTodos";

const { todoItems, addTodo, deleteTodo, toggleTodo, editTodo, loadTodos } =
  useTodos();
const inputText = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

// ─── 统计 ───
const pendingCount = computed(
  () => todoItems.value.filter((i) => !i.finished).length,
);
const finishedCount = computed(
  () => todoItems.value.filter((i) => i.finished).length,
);
const allDone = computed(
  () => todoItems.value.length > 0 && todoItems.value.every((i) => i.finished),
);

// ─── 添加 ───
function handleAdd() {
  const text = inputText.value.trim();
  if (!text) return;
  addTodo(text);
  inputText.value = "";
  inputRef.value?.focus();
}

// ─── 礼花动画（全部完成时触发） ───
let prevAllDone = false;

watch(allDone, (current) => {
  if (current && !prevAllDone) {
    fireConfetti();
  }
  prevAllDone = current;
});

function fireConfetti() {
  const duration = 2800;
  const end = Date.now() + duration;
  const colors = [
    "#ff6b6b",
    "#feca57",
    "#48dbfb",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
  ];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.6 },
      colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.6 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.4 },
      colors,
      scalar: 0.9,
    });
  }, duration - 400);
}

// ─── 生命周期 ───
onMounted(async () => {
  await loadTodos();
  inputRef.value?.focus();
});
</script>

<style scoped lang="scss">
.todo-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-page);
  overflow: hidden;
  transition: background 0.3s;
}

// ─── 顶部 ───
.header {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  transition: all 0.3s;

  .header-main {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 6px;
    letter-spacing: 0.5px;
    transition: color 0.3s;
  }

  .subtitle {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0;
    transition: color 0.3s;

    .pending-label {
      color: var(--warning);
      font-weight: 500;
    }
    .divider {
      margin: 0 6px;
      color: var(--text-disabled);
    }
    .finished-label {
      color: var(--success);
      font-weight: 500;
    }
  }
}

// ─── 列表区域 ───
.list-area {
  flex: 1;
  overflow-y: auto;
  padding: 10px 18px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-disabled);
  user-select: none;
  pointer-events: none;

  .empty-icon {
    font-size: 52px;
    margin-bottom: 14px;
    animation: float 3s ease-in-out infinite;
  }
  p {
    margin: 3px 0;
    font-size: 15px;
  }
  .empty-hint {
    font-size: 13px;
    color: var(--text-disabled);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 8px;
}

.drag-ghost {
  opacity: 0.35;
  background: var(--accent-light);
  border-radius: 12px;
}

// ─── 底部输入栏 ───
.input-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  transition: all 0.3s;

  .input-field {
    flex: 1;
    height: 42px;
    padding: 0 16px;
    border: 2px solid var(--border);
    border-radius: 12px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    background: var(--bg-page);
    color: var(--text-primary);

    &:focus {
      border-color: var(--accent);
      background: var(--bg-surface);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }

    &::placeholder {
      color: var(--text-disabled);
    }
  }

  .add-btn {
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 12px;
    background: var(--scrollbar-thumb);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;

    &.active {
      background: var(--accent);
      color: #fff;
      box-shadow: 0 2px 8px var(--accent-glow-strong);
    }

    &:hover.active {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }

    &:active.active {
      transform: translateY(0);
    }
  }
}
</style>
