"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var App_1 = require("./App");
require("./styles/light.css"); // 強制亮色主題
// Git rebase 操作說明（可移除）
// 若需一鍵 rebase main 分支，可於 package.json scripts 加入：
// "rebase:main": "pwsh scripts/git-rebase-main.ps1"
// 並於 scripts 目錄下建立 git-rebase-main.ps1 腳本（已自動建立）
// 使用方式：npm run rebase:main
var container = document.getElementById('root');
var root = (0, client_1.createRoot)(container);
root.render(<App_1.default />);
