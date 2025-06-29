# 多平台代理模式設計說明

本系統採用代理模式（Proxy Pattern）整合多平台 API，提升擴展性、維護性與安全性。

## 目錄結構建議

backend/
  ├─ src/
  │    ├─ proxies/           # 各平台 API 代理（如 GithubProxy.ts）
  │    └─ services/          # 業務整合層（如 integrationService.ts）
  ├─ .env.example            # 環境變數範例
  └─ .gitignore              # 忽略 .env

## 代理層設計
- 每個平台建立獨立 Proxy class，專責 API 認證、請求、錯誤處理、快取。
- Service 層統一調用各 Proxy，實現平台間解耦。
- 支援多平台動態切換與擴充。

## 環境變數管理
- 所有敏感資訊（如 GITHUB_PAT）僅存於 .env，並於 .gitignore 忽略。
- .env.example 提供參考格式，請勿將 .env 實際內容提交。
- CI/CD 部署時，於 GitHub/Supabase Secrets 設定對應變數。

## CI/CD 建議
- workflow 檢查必要環境變數，缺少時自動提示。
- 部署前自動注入 Secrets，確保安全。

## 參考
- docs/API_LIBRARY.md
- docs/ARCHITECTURE.md

如需更多平台代理範例、API 文件或自動化腳本，請參考 docs/ 或聯絡維護者。
