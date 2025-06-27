# JunAiKey_OmniKey

## 專案簡介

本專案為 TypeScript 入門範例，具備模組化結構與環境變數支援。

## 執行方式

1. 安裝依賴：

    ```powershell
    npm install
    ```

2. 編譯 TypeScript：

    ```powershell
    npx tsc --outDir dist
    ```

3. 執行主程式：

    ```powershell
    node dist/index.js
    ```

## 程式結構

- `index.ts`：主程式，啟動訊息並呼叫 greet 模組。
- `greet.ts`：匯出 greet(name: string) 函式，回傳歡迎訊息。

### index.ts 範例內容
```typescript
import { greet } from './greet';

function main() {
    console.log('🚀 JunAiKey_OmniKey TypeScript 專案啟動！');
    const user = process.env.USER || '世界';
    console.log(greet(user));
}

main();
```

### greet.ts 範例內容
```typescript
export function greet(name: string): string {
    return `Hello, ${name}! 歡迎使用 JunAiKey_OmniKey`;
}
```

## 執行結果範例
```
🚀 JunAiKey_OmniKey TypeScript 專案啟動！
Hello, 世界! 歡迎使用 JunAiKey_OmniKey
```

---

# GitHub 專案初始化與推送流程

1. 開啟終端機（PowerShell）並切換到專案資料夾：

    ```powershell
    cd \DingJun1028\JunAiKey_OmniKey
    ```

2. 初始化 Git 倉庫（如尚未初始化）：

    ```powershell
    git init
    ```

3. 加入所有檔案到暫存區：

    ```powershell
    git add .
    ```

4. 提交檔案：

    ```powershell
    git commit -m "初始化專案與首次提交"
    ```

5. 設定遠端倉庫（如尚未設定）：

    ```powershell
    git remote add origin https://github.com/DingJun1028/JunAiKey_OmniKey.git
    ```

6. 推送到 GitHub：

    ```powershell
    git push origin main
    ```

---

# CI/CD & Deploy to Vercel

此工作流程會在每次 push 或 pull request 至 main 分支時自動執行：

1. 取得原始碼
2. 設定 Node.js 20 環境
3. 安裝 npm 依賴
4. 編譯 TypeScript 原始碼
5. 自動部署至 Vercel（需設定下列 GitHub Secrets）

## 必要 GitHub Secrets
- `VERCEL_TOKEN`：Vercel 個人存取權杖
- `VERCEL_ORG_ID`：Vercel 組織 ID
- `VERCEL_PROJECT_ID`：Vercel 專案 ID

請至 GitHub 專案頁面 → Settings → Secrets and variables → Actions 新增上述三個 Secrets。

---

如需本地測試 TypeScript 編譯：
```powershell
npm install
npx tsc --outDir dist
node dist/index.js
```

如需自動化測試腳本或 Vercel 設定檔，請告知！
