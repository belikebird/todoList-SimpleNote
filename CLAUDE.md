# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an Electron + Vue 3 + TypeScript + Vite desktop application for managing todo lists and sticky notes. Key features include:
- Drag-and-drop todo items with vuedraggable
- Sticky notes module with colored tabs, history sidebar, and auto-save
- Theme customization (light/dark mode, accent colors)
- Data persistence via Electron IPC to local storage
- Confetti animation when all todos are completed
- Responsive UI with modern CSS styling

## Common Development Commands

### Development
```bash
npm run dev          # Start development server with hot reload
npm run preview      # Preview production build
```

### Build
```bash
npm run build        # Build for production (Vue + Electron)
```

### Type Checking
```bash
vue-tsc              # Type check Vue/TS files
```

## Project Structure

### Core Architecture
- **Electron Main Process**: `electron/main.ts` - handles window management and file I/O
- **Electron Preload**: `electron/preload.ts` - exposes IPC API to renderer
- **Vue Entry Point**: `src/main.ts` - initializes Vue app and theme
- **Root Component**: `src/App.vue` - nav bar with page tabs (todo/notes), conditional rendering
- **Todo Page**: `src/pages/todoList/index.vue` - contains the todo list UI logic
- **Notes Page**: `src/pages/notes/index.vue` - sticky notes orchestrator (tabs + sidebar + editor)

### Key Composables
- `src/composables/useTodos.ts` - manages todo state, persistence, and CRUD operations
- `src/composables/useTheme.ts` - handles theme state, storage, and DOM updates
- `src/composables/useNotes.ts` - manages sticky note state, persistence, CRUD, and color management
  - Exports `NoteItem`, `NoteColor`, `NOTE_COLOR_MAP`, `getNoteTitle()`, `getRelativeTime()`

### Component Structure
- `src/pages/todoList/` - todo list page
  - `index.vue` - page layout and logic
  - `components/todoItem.vue` - individual todo item component
- `src/pages/notes/` - sticky notes page
  - `index.vue` - orchestrator with tab bar, sidebar, and editor layout
  - `components/NoteTabBar.vue` - horizontal colored tabs with close/add buttons
  - `components/NoteSidebar.vue` - history list with color dots, title preview, timestamps
  - `components/NoteEditor.vue` - textarea editor with color picker and status bar

## Important Patterns

### State Management
- Uses Vue 3 Composition API with `ref` and `computed`
- Global state (todos, notes, theme) managed as module-level singletons in composables
- Automatic persistence via watchers (todos and notes save with 300ms debounce)

### Navigation
- No Vue Router - simple conditional rendering in `App.vue` via `currentPage` ref (`'todo' | 'notes'`)
- Top nav bar with two tabs; pages swapped with `v-if`/`v-else`

### Electron Integration
- IPC communication via `window.ipcRenderer` in renderer process
- Main process exposes `load-todos`/`save-todos` and `load-notes`/`save-notes` handlers
- Data stored in user data directory (`app.getPath('userData')`) as JSON files (`todos.json`, `notes.json`)

### Theming System
- CSS variables managed via `data-mode` and `data-accent` attributes on `<html>`
- Theme config persisted in localStorage with key `todo-theme`
- Supports light/dark modes and 4 accent colors (blue, green, purple, orange)

### Build Configuration
- Vite config in `vite.config.ts` with Electron plugin
- Electron builder configuration handled automatically
- Output directory: `dist-electron/` for main process, `dist/` for renderer

## Development Notes
- This is not a git repository - initialize git if needed for version control
- Run `npm install` if dependencies are missing
- For Electron debugging, use Chrome DevTools in the running app
- TypeScript type checking requires `vue-tsc` due to `.vue` file support