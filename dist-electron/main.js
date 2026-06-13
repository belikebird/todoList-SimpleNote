import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
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
ipcMain.handle("save-todos", (_event, json) => {
  try {
    fs.writeFileSync(getTodosFilePath(), json, "utf-8");
    return true;
  } catch (err) {
    console.error("[save-todos]", err);
    return false;
  }
});
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
ipcMain.handle("save-notes", (_event, json) => {
  try {
    fs.writeFileSync(getNotesFilePath(), json, "utf-8");
    return true;
  } catch (err) {
    console.error("[save-notes]", err);
    return false;
  }
});
function getShowNotesIdFilePath() {
  return path.join(app.getPath("userData"), "showNotesId.json");
}
ipcMain.handle("load-show-notesId", () => {
  try {
    const filePath = getShowNotesIdFilePath();
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  } catch (err) {
    console.error("[load-show-notesId]", err);
  }
  return null;
});
ipcMain.handle("save-show-notesId", (_event, json) => {
  try {
    const filePath = getShowNotesIdFilePath();
    fs.writeFileSync(filePath, json, "utf-8");
    return true;
  } catch (err) {
    console.error("[save-show-notesId]", err);
    return false;
  }
});
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    autoHideMenuBar: true,
    width: 1e3,
    height: 700,
    minWidth: 600,
    minHeight: 440,
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
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
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
