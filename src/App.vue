<script setup lang="ts">
import { ref } from 'vue'
import TodoListPage from './pages/todoList/index.vue'
import NotesPage from './pages/notes/index.vue'

type PageKey = 'todo' | 'notes'
const currentPage = ref<PageKey>('todo')
</script>

<template>
  <div class="app-root">
    <nav class="app-nav">
      <button
        :class="{ active: currentPage === 'todo' }"
        @click="currentPage = 'todo'"
      >
        待办
      </button>
      <button
        :class="{ active: currentPage === 'notes' }"
        @click="currentPage = 'notes'"
      >
        便签
      </button>
    </nav>
    <TodoListPage v-if="currentPage === 'todo'" />
    <NotesPage v-else />
  </div>
</template>

<style scoped lang="scss">
.app-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 40px;
  min-height: 40px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  user-select: none;

  button {
    position: relative;
    padding: 0 24px;
    height: 100%;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: var(--text-primary);
      background: var(--bg-surface-hover);
    }

    &.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
      font-weight: 600;
    }
  }
}

.app-nav + * {
  flex: 1;
  min-height: 0;
}
</style>
