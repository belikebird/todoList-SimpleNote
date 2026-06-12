import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// ─── 数据持久化：将 todo 以 JSON 存储在用户数据目录 ───
function getTodosFilePath() {
  return path.join(app.getPath("userData"), "todos.json");
}

ipcMain.handle("load-todos", () => {
  try {
    const filePath = getTodosFilePath();
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  } catch (err) {
    console.error("[load-todos]", err);
  }
  return null;
});

ipcMain.handle("save-todos", (_event, json: string) => {
  try {
    fs.writeFileSync(getTodosFilePath(), json, "utf-8");
    return true;
  } catch (err) {
    console.error("[save-todos]", err);
    return false;
  }
});

// ─── 便签数据持久化 ───
function getNotesFilePath() {
  return path.join(app.getPath("userData"), "notes.json");
}

ipcMain.handle("load-notes", () => {
  try {
    const filePath = getNotesFilePath();
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  } catch (err) {
    console.error("[load-notes]", err);
  }
  return null;
});

ipcMain.handle("save-notes", (_event, json: string) => {
  try {
    fs.writeFileSync(getNotesFilePath(), json, "utf-8");
    return true;
  } catch (err) {
    console.error("[save-notes]", err);
    return false;
  }
});

// ─── 窗口管理 ───
let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    autoHideMenuBar: true,
    width: 1000,
    height: 700,
    minWidth: 600,
    minHeight: 440,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
