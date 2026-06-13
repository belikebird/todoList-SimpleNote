import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

export interface ThemeConfig {
  mode: ThemeMode
}

const STORAGE_KEY = 'todo-theme'

const defaultTheme: ThemeConfig = {
  mode: 'light',
}

function loadTheme(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ThemeConfig
      if (parsed.mode) return parsed
    }
  } catch {}
  return { ...defaultTheme }
}

function saveTheme(theme: ThemeConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
}

const theme = ref<ThemeConfig>(loadTheme())

function applyTheme(t: ThemeConfig) {
  const root = document.documentElement
  root.setAttribute('data-mode', t.mode)
}

// 同步到 DOM
watch(theme, applyTheme, { immediate: true })

export function useTheme() {
  function setMode(mode: ThemeMode) {
    theme.value = { ...theme.value, mode }
    saveTheme(theme.value)
  }

  function toggleMode() {
    setMode(theme.value.mode === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    setMode,
    toggleMode,
  }
}
