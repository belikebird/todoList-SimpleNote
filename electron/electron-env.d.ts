/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.mjs
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_DEV_SERVER_URL: string | undefined
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, exposed in `preload.ts`
interface Window {
  ipcRenderer: {
    on(channel: string, listener: (event: any, ...args: any[]) => void): void
    off(channel: string, listener?: (...args: any[]) => void): void
    send(channel: string, ...args: any[]): void
    invoke(channel: string, ...args: any[]): Promise<any>
  }
}
