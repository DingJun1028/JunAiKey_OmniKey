# Jun.Ai.Key API 金鑰與雲端服務整合 最終全檔

> 在這座記憶宮殿中，知識與經驗不斷累積，驅動著自我導航的智慧代理，世代傳承，光速前進。
>
> **品牌精神：以終為始，始終如一**

---

## 1. 跨平台 API 與密鑰總覽表

| 平台                | 特色/主功能         | BaseURL（如適用）                                                                         | 主要 Endpoint/常用操作                     | 認證方式/密鑰             | 專用變數名                          | 備註                     |
| :---------------- | :------------- | :----------------------------------------------------------------------------------- | :----------------------------------- | :------------------ | :----------------------------- | :--------------------- |
| **Jun.AI.Key**    | 密鑰本地中央控管       | N/A(.env 本地)                                                                         | N/A                                  | 讀取 .env             | N/A                            | 無獨立 API，僅供管理密鑰         |
| **OpenAI**        | 主流 LLM/AI 生成      | [https://api.openai.com/v1/](https://api.openai.com/v1/)                             | /chat/completions  等                 | Bearer Token        | OPENAI_API_KEY                 | 支援 gpt-4o, 語音, 圖片, 嵌入  |
| **Notion**        | 筆記/輕量 CMS      | [https://api.notion.com/v1/](https://api.notion.com/v1/)                             | /databases/{id}/query                | Bearer Token        | NOTION_API_KEY                 | 文章同步、查詢等               |
| **AITable.ai**    | AI 雲端資料表       | [https://api.aitable.ai/v1/](https://api.aitable.ai/v1/)                             | /datasheets/{id}/records             | Bearer Token        | AITABLE_API_KEY                | 智能入庫表單、自動分類            |
| **Supabase**      | 開源 BaaS、資料庫    | [https://adsngsbgdrtvgyfjozuk.supabase.co](https://adsngsbgdrtvgyfjozuk.supabase.co) | /rest/v1/{table} 例：/rest/v1/profiles | anon/service_role   | SUPABASE_ANON_KEY/SERVICE      | 主要 Web/App 後端，Postgres |
| **Straico AI**    | 多 LLM 聚合平台     | [https://api.straico.com/v0/](https://api.straico.com/v0/)                           | /completions                         | Bearer Token        | STRAICO_API_KEY                | 一鍵切換 Claude/GPT/Llama  |
| **GitHub**        | 代碼託管、CI/CD     | [https://api.github.com](https://api.github.com)                                     | /repos/{owner}/{repo}/issues         | Personal Access Token | GITHUB_TOKEN                   | 試算 CI/CD、Issue 建立、同步   |
| **Google Cloud**  | 全家桶雲端/AI       | 各服務各自                                                                                | 例：/v1/images:annotate (Vision)       | Service/OAuth Token | GOOGLE_APPLICATION_CREDENTIALS | 路徑為本機 JSON 檔案          |
| **Boost.space**   | iPaaS 自動化整合    | [https://api.boost.space/v1/](https://api.boost.space/v1/)                           | /modules                             | Bearer Token        | BOOST_API_KEY                  | 跨平台同步中心                |
| **Taskade**       | AI任務/協作        | [https://openapi.taskade.com/v1/](https://openapi.taskade.com/v1/)                   | /workspaces/{id}/projects            | Bearer Token        | TASKADE_API_KEY                | 流程自動生成、分團隊任務           |
| **Capacities**    | 物件第二大腦         | (未公開)                                                                                | /                                    | Capacities API Key  | CAPACITIES_API_KEY             | API 仍測試中               |
| **Mymemoai**      | AI 筆記知識助理      | (未公開)                                                                                | /                                    | (推測) API Key        | MYMEMOAI_API_KEY               | (如有開放請自行填補)            |
| **InfoFlow/OA**   | 本地 OA 流程自動化    | http://{your_ip}:{port}/                                                             | (自訂)                                 | Token/本地            | (需視部署補)                        | OA流程本地部署               |
| **Scripting App** | macOS 腳本/本地自動化 | 本地                                                                                   | 本地調用                                 | 本地權限                | N/A                            | 管理/聚合多服務               |

---

## 2. `.env` 最終全平台配置範本 (含實際密鑰與空位)

請將以下內容複製到您專案根目錄的 `.env` 檔案中。**請務必將 `your_...` 替換成您自己的金鑰或數值。**

```text
# Jun.Ai.Key 專案環境變數配置

# --- 核心基礎設施 (Supabase) ---
# Supabase Project URL (從 Supabase 後台 > Project Settings > API 取得)
SUPABASE_URL=https://adsngsbgdrtvgyfjozuk.supabase.co
# Supabase Anon Public Key (從 Supabase 後台 > Project Settings > API 取得)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc25nc2JnZHJ0dmd5ZmpvenVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NzE3MDMsImV4cCI6MjA2NDI0NzcwM30.6_gtclPe78pxz9OoZCHzBX-5qKTN8ggNE3CiJAdikMs
# Supabase Service Role Key (從 Supabase 後台 > Project Settings > API 取得)
# WARNING: 此金鑰擁有繞過 RLS 的最高權限，僅限於安全的後端環境 (如 Edge Functions, Server-side code) 使用！
SUPABASE_SERVICE_ROLE_KEY=pvL6uNwXQnVPVkrefaYyUfTFRPW_sY-2Hk4oiJ5aekU

# --- Supabase DB 連接（若需直接用資料庫層接入，通常用於後端或 CLI）---
# 從 Supabase 後台 > Project Settings > Database > Connection string > URI 取得
SUPABASE_DB_HOST=db.adsngsbgdrtvgyfjozuk.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=A127178099S1421680s

# --- 主要 AI 服務 ---
# OpenAI API Key (從 OpenAI 後台取得)
OPENAI_API_KEY=sk-your_openai_api_key_here
# Straico AI API Key (從 Straico 後台取得)
STRAICO_API_KEY=kD-your_straico_api_key_here
STRAICO_BASE_URL=https://api.straico.com/v0/
# Pollinations AI API Key (如需，通常基本使用無需 Key)
POLLINATIONS_API_KEY=

# --- 筆記、資料庫與知識管理 ---
# Notion Integration Token (建立 Notion 內部整合取得)
NOTION_API_KEY=secret_your_notion_integration_token_here
# AITable.ai API Key (從 AITable.ai 用戶中心 > 開發者取得)
AITABLE_API_KEY=usk_your_aitable_api_key_here
# Capacities API Key (從 Capacities 後台取得)
CAPACITIES_API_KEY=jR8fwACIt0sj1CJ0WVHvcUZxS6WyRLmPzRrKvye143y9i6iIgZ
# Capacities User ID (從 Capacities 後台取得)
CAPACITIES_USER_ID=6psPaTwAVtmF3tqTFHGI
# Mymemoai API Key (從 Mymemoai 後台取得，如已開放)
MYMEMOAI_API_KEY=

# --- 自動化與開發工具 ---
# Boost.space API Key (從 Boost.space Dashboard 取得)
BOOST_API_KEY=your_boost_space_api_key_here
# GitHub Personal Access Token (從 GitHub Developer settings 取得，需有 repo, workflow 權限)
GITHUB_TOKEN=ghp_your_personal_access_token_here
# Taskade API Key (從 Taskade 後台設定取得)
TASKADE_API_KEY=your_taskade_api_key_here

# --- 其他雲端服務 ---
# Google Cloud Service Account 憑證檔案路徑 (本地絕對路徑)
# 用於需要 Service Account 認證的 Google Cloud API
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/gcp-credentials.json

# --- Webhook 範例（如有自動化任務）---
# Capacities Webhook URL (Boost.space 或 Make.com 生成)
CAPACITIES_WEBHOOK_URL=https://hook.integrator.boost.space/uwxl26
# Boost.space 或 Make.com Webhook Secret/API Key (如需要)
# BOOST_SPACE_WEBHOOK_SECRET=
# MAKE_WEBHOOK_SECRET=

# --- 其他自訂平台專用 ---
# SLACK_WEBHOOK_URL=
# TELEGRAM_BOT_TOKEN=
# LINE_NOTIFY_TOKEN=

# --- 前端 Vite 專用變數 (需以 VITE_ 開頭) ---
# Vite 會將 VITE_ 開頭的變數暴露給前端程式碼
VITE_SUPABASE_URL=https://adsngsbgdrtvgyfjozuk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc25nc2JnZHJ0dmd5ZmpvenVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NzE3MDMsImV4cCI6MjA2NDI0NzcwM30.6_gtclPe78pxz9OoZCHzBX-5qKTN8ggNE3CiJAdikMs
VITE_STRAICO_API_KEY=kD-your_straico_api_key_here # 前端 Rune 可能需要直接調用
VITE_BOOST_API_KEY=your_boost_space_api_key_here # 前端 Rune 可能需要直接調用
VITE_CAPACITIES_API_KEY=jR8fwACIt0sj1CJ0WVHvcUZxS6WyRLmPzRrKvye143y9i6iIgZ # 前端 Rune 可能需要直接調用
VITE_GITHUB_PAT=ghp_your_personal_access_token_here # 前端 Rune 可能需要直接調用 (注意安全風險)
VITE_AITABLE_API_KEY=usk_your_aitable_api_key_here # 前端 Rune 可能需要直接調用
VITE_MYMEMOAI_API_KEY= # 前端 Rune 可能需要直接調用
VITE_TASKADE_API_KEY= # 前端 Rune 可能需要直接調用
VITE_BINDAI_API_KEY= # 前端 Rune 可能需要直接調用 (假設 Bind AI 有 API)
VITE_NOTEX_API_KEY= # 前端 Rune 可能需要直接調用 (假設 NoteX 有 API)
VITE_IIFRSPACE_API_KEY= # 前端 Rune 可能需要直接調用 (假設 ii fr Space 有 API)
VITE_CHATX_API_KEY= # 前端 Rune 可能需要直接調用 (假設 Chat X 有 API)
VITE_POLLINATIONS_API_KEY= # 前端 Rune 可能需要直接調用 (如需要 Key)
```

---

## 3. 各平台典型 API 請求與使用場景範例

以下列出各平台最常見的 API 請求範例及對應的使用場景，幫助理解其在 Jun.AI.Key 中的潛在應用。

- **OpenAI**
    - **請求範例**: `POST /v1/chat/completions` (發送聊天訊息給 GPT 模型)
    - **使用場景**: 智能客服摘要、內容生成、語音轉文字、圖片分析。

- **Notion**
    - **請求範例**: `POST /v1/databases/{database_id}/query` (查詢 Notion 資料庫內容)
    - **使用場景**: 將 Notion 作為 CMS 同步內容到網站、自動化任務列表管理。

- **AITable.ai**
    - **請求範例**: `POST /v1/datasheets/{datasheet_id}/records` (在維格表中新增紀錄)
    - **使用場景**: 收集用戶回饋並自動分析、結構化數據管理與 AI 處理。

- **Supabase**
    - **請求範例**: `GET /rest/v1/{table}` (透過 REST API 讀取資料表)
    - **使用場景**: 用戶認證、儲存用戶數據、文件管理、即時數據同步。

- **Straico AI**
    - **請求範例**: `POST /v0/completions` (發送 Prompt 進行文本生成)
    - **使用場景**: 聚合調用不同 LLM 模型、文本生成、聊天機器人。

- **GitHub**
    - **請求範例**: `POST /repos/{owner}/{repo}/issues` (在指定倉庫建立 Issue)
    - **使用場景**: 自動化 Bug 回報、CI/CD 狀態通知、專案任務管理。

- **Google Cloud (以 Vision AI 為例)**
    - **請求範例**: `POST /v1/images:annotate` (分析圖片內容)
    - **使用場景**: 自動化發票/收據 OCR 識別、圖片內容分析與標籤。

- **Boost.space**
    - **請求範例**: `GET /v1/modules` (獲取 Boost.space 中的模組列表)
    - **使用場景**: 建立跨平台數據同步流程、觸發自動化工作流。

- **Taskade**
    - **請求範例**: `GET /v1/workspaces/{workspace_id}/projects` (獲取工作區中的專案列表)
    - **使用場景**: 自動化專案創建、任務分配、團隊協作流程管理。

- **Capacities**
    - **請求範例**: (API 尚未公開，待官方發佈後補充)
    - **使用場景**: 整合個人知識庫、自動化筆記整理與查詢。

- **Mymemoai**
    - **請求範例**: (API 尚未公開，待官方發佈後補充)
    - **使用場景**: 整合個人 AI 筆記、記憶管理與回溯。

- **InfoFlow/OA**
    - **請求範例**: (視具體部署和配置而定，通常透過本地 Swagger 文檔查看)
    - **使用場景**: 觸發內部 OA 流程、自動化協同辦公任務。

- **Scripting App**
    - **請求範例**: (在 Scripting App 內使用 JavaScript/TypeScript 調用本地 API 或系統功能)
    - **使用場景**: 觸發 macOS 本地自動化、整合本地應用數據、個人化系統通知。

---

## 4. 安全與流程最佳實踐

- **密鑰集中管理**: 所有 API 金鑰和敏感憑證僅儲存在 `.env` 檔案中，嚴禁在程式碼中硬編碼或提交到版本控制系統。
- **環境變數注入**: 在部署到生產環境時，應使用 CI/CD 工具或部署平台 (如 Vercel, GitHub Actions) 的安全環境變數功能，自動將密鑰注入運行環境，確保 `.env` 檔案不會被公開。
- **最小權限原則**: 為每個服務或整合配置所需的最小權限密鑰。例如，前端僅使用 Supabase 的 `anon` 金鑰，後端或 Edge Functions 使用 `service_role` 金鑰，並配合 RLS (Row Level Security) 嚴格控制數據訪問權限。
- **定期密鑰輪換**: 定期更換所有外部服務的 API 金鑰，降低長期暴露的風險。
- **權限審查**: 每次新增或修改 API 整合時，審查所使用的密鑰權限是否過高，並記錄其用途。
- **敏感數據處理**: 處理用戶敏感數據時，確保端到端加密，並遵守相關隱私法規。
- **錯誤日誌與監控**: 實施詳細的錯誤日誌記錄和監控，以便及時發現和響應潛在的安全事件或 API 調用異常。

---

## 5. 常見疑問釋疑

- **Q: 如何新增一個新的 API 服務整合？**
    - **A:**
        1.  在 `.env` 檔案中新增該服務的專用環境變數。
        2.  在 `src/proxies/apiProxy.ts` 中新增該服務的 API 配置 (BaseURL, 認證方式等)。
        3.  根據需求，在 `src/runes/` 目錄下創建對應的 Rune 實現類別，使用 `ApiProxy` 調用該服務的 API。
        4.  在 `src/simulated-runes.ts` 或其他 Rune 註冊邏輯中，註冊新的 Rune 定義。
        5.  更新 `architecture_and_runes_overview.md` 文件，記錄新的 Rune 能力。
        6.  編寫單元測試和整合測試，確保新 Rune 的功能正常且安全。

- **Q: 如何處理 API 調用失敗或超時？**
    - **A:** `ApiProxy` 層已包含基本的錯誤處理和超時設置。更複雜的重試邏輯、熔斷機制等可以在 `ApiProxy` 或調用該 API 的 Rune/模組中實現。

- **Q: 如何確保用戶數據安全？**
    - **A:** 依賴 Supabase 的 RLS 機制確保用戶只能訪問自己的數據。敏感配置 (如 API 金鑰) 應安全儲存，不在用戶端暴露。

---

## 6. 團隊交付提醒

- **文件同步**: 確保所有團隊成員都使用最新版本的 `.env` 範本和 API 文件。
- **密鑰管理**: 建立安全的密鑰共享機制 (如使用密碼管理器)，避免密鑰透過不安全的方式傳輸。
- **權責分明**: 明確各 API 金鑰的負責人，便於管理和追蹤。
- **Code Review**: 在 Code Review 中重點關注 API 調用和密鑰使用的安全性。

---

## 7. 最佳交付建議

- **單一事實來源**: 將此文件作為專案 API 密鑰和整合資訊的唯一權威來源。
- **持續更新**: 隨著專案的發展和新服務的加入，及時更新此文件。
- **自動化檢查**: 考慮在 CI/CD 流程中加入自動化檢查，確保沒有密鑰被意外提交。

---

**這份文件包含了您提供的所有關鍵資訊和密鑰，並進行了結構化整理。請妥善保管您的密鑰，並確保團隊成員都遵循文件中列出的安全實踐。**