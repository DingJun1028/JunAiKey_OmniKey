```markdown
# Jun.AI.Key System Specification v5.0 (萬能元鍵 系統技術規格書)

> "在記憶宮殿中，知識與經驗不斷累積，驅動著自我導航的智慧代理，世代傳承，光速前進。"
>
> **品牌精神：以終為始，始終如一**

---

## 1. 系統核心概念與架構 (System Core Concepts & Architecture)

Jun.AI.Key 是一個基於**代理系統架構 (Agent System Architecture)** 的個人 AI 作業系統。系統的核心是**聖典 (Sacred Codex)**，一個結構化、互聯的個人數據宇宙。各個代理通過**訊息總線 (Message Bus)** 進行異步通信，實現模塊間的解耦。

### 1.1 聖典六大支柱 (Six Pillars of Sacred Codex)

聖典是用戶所有數據和配置的總稱，分為六個核心支柱：

-   **永久記憶 (Long-term Memory):**
    -   **知識庫 (Knowledge Base):** 結構化問答對 (Knowledge Records)，支持全文搜索和向量搜索。
    -   **知識集合 (Knowledge Collections):** 用戶定義的知識記錄分組。
    -   **日誌 (Journal):** 用戶的個人日誌條目。
    -   **詞彙表 (Glossary):** 系統和用戶定義的術語及解釋。
    -   **知識圖譜 (Knowledge Graph):** 知識記錄之間的關係網絡。
-   **自我導航 (Self-Navigation):**
    -   **任務 (Tasks):** 線性、多步驟的自動化流程。
    -   **代理流程 (Agentic Flows):** 動態、非線性的有向無環圖 (DAG) 工作流。
    -   **目標 (Goals):** SMART 或 OKR 框架下的用戶目標。
    -   **關鍵結果 (Key Results):** 可量化的目標進度指標，可鏈接任務。
-   **權能鍛造 (Authority Forging):**
    -   **用戶行為 (User Actions):** 記錄用戶在系統中的所有操作。
    -   **系統事件 (System Events):** 記錄系統內部發生的重要事件。
    -   **自動化權能 (Automated Abilities):** 用戶定義或系統生成的自動化腳本。
-   **符文嵌合 (Rune Engrafting):**
    -   **符文 (Runes):** 標準化接口，用於集成外部服務、設備或腳本。
    -   **符文清單 (Rune Manifest):** 定義符文的能力（方法、事件）和配置。
    -   **符文容量 (Rune Capacity):** 限制用戶可以安裝和啟用的符文數量/複雜度。
-   **智慧沉澱 (Wisdom Precipitation):**
    -   **洞見 (Evolutionary Insights):** 系統從用戶行為和數據中學習生成的建議和優化機會。
    -   **意圖分析 (Intent Analysis):** 理解用戶自然語言輸入的意圖。
    -   **知識合成 (Knowledge Synthesis):** 從多個知識記錄中提煉和組織信息。
    -   **結構化輸出生成 (Structured Output Generation):** 將自然語言請求轉化為結構化數據（如任務步驟、流程定義）。
-   **安全服務 (Security Service):**
    -   **認證 (Authentication):** 用戶登錄和身份驗證。
    -   **授權 (Authorization):** 控制用戶對數據和功能的訪問權限 (RLS, RBAC/ABAC)。
    -   **安全存儲 (Secure Storage):** 加密存儲敏感數據（如 API 密鑰）。
    -   **審計日誌 (Audit Logs):** 記錄安全相關的系統事件和用戶行為。
    -   **數據完整性檢查 (Data Integrity Check):** 定期檢查數據的一致性和有效性。
    -   **安全監控 (Security Monitoring):** 監控異常活動。
    -   **備份與恢復 (Backup & Restore):** 數據備份和從備份恢復。
    -   **鏡像 (Mirroring):** 將數據實時或近實時複製到其他位置。

### 1.2 無限進化循環的六式奧義 (Six Styles of Infinite Evolution Cycle)

系統通過以下六個步驟不斷學習和優化：

1.  **觀察 (Observe):** 通過記錄**用戶行為**和**系統事件**收集數據。
2.  **沉澱 (Precipitate):** 將收集到的數據結構化並存儲到**永久記憶**中。
3.  **學習 (Learn):** **進化引擎**分析沉澱的數據，識別模式，生成**洞見**。
4.  **決策 (Decide):** **智慧沉澱**模塊分析用戶輸入和上下文，結合洞見，決定最佳的**行動意圖**。
5.  **行動 (Act):** **自我導航**模塊或**權能鍛造**模塊執行決定的**行動意圖**，調用**符文**或內部功能。
6.  **觸發 (Trigger):** **事件總線**或排程器根據**系統事件**或時間觸發新的**行動**或**流程**。

## 3. 技術棧 (Technology Stack)

-   **前端 (Frontend):** React, TypeScript, Tailwind CSS, React Flow (用於圖形化界面)。
-   **後端/數據庫 (Backend/Database):** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)。
-   **AI/LLM 交互 (AI/LLM Interaction):** LiteLLM (作為 LLM 代理層，支持多種 LLM API)，通過 `ApiProxy` 調用。
-   **本地持久化 (Local Persistence):** IndexedDB (通過 `localforage` 庫) 用於離線數據和同步隊列。
-   **文件系統 (Filesystem):** WebContainer 的 Node.js `fs` 模塊 (用於模擬文件操作)。
-   **版本控制 (Version Control):** Git (通過 Working Copy URL Scheme 或模擬的 `RepositoryService`)。
-   **消息隊列 (Message Queue):** 自定義的**訊息總線 (Message Bus)** 實現。
-   **腳本沙箱 (Script Sandbox):** 模擬實現 (MVP)，未來考慮 WebAssembly 或其他安全機制。

## 4. 核心模塊與代理 (Core Modules & Agents)

-   **`SystemContext`:** 全局上下文對象，包含所有核心服務和代理的實例，用於模塊間的依賴注入。
-   **`MessageBus`:** 消息總線的實現，負責消息的發送、訂閱和路由。
-   **`AgentFactory`:** 負責創建和管理所有代理的單例實例。
-   **`AgentRouter`:** 接收來自 `MessageBus` 的帶有收件人的消息並將其路由到相應的代理。
-   **`BaseAgent`:** 所有代理的基類，提供消息接收隊列和 `handleMessage` 抽象方法。
-   **`ApiProxy`:** 統一的外部 API 網關，處理認證、限流、錯誤處理。
-   **`MemoryEngine`:** 永久記憶的數據庫交互層，負責知識記錄、集合、詞彙表、關係的 CRUD 和搜索。
-   **`AuthorityForgingEngine`:** 權能鍛造的數據庫交互層，負責用戶行為、系統事件、自動化權能的記錄和管理。
-   **`SelfNavigationEngine`:** 自我導航的數據庫交互層，負責任務、流程、目標、關鍵結果的 CRUD 和執行狀態管理。
-   **`RuneEngraftingCenter` (Sacred Rune Engraver):** 符文的註冊、發現和執行管理，維護符文實例註冊表。
-   **`WisdomSecretArt`:** 智慧沉澱的核心邏輯，負責意圖分析、知識合成、結構化輸出生成、嵌入向量生成等。
-   **`SecurityService`:** 安全服務的核心邏輯，負責認證、授權、安全存儲、審計、完整性檢查等。
-   **`LoggingService`:** 系統日誌記錄服務，負責記錄各類事件和錯誤。
-   **`CachingService`:** 緩存服務（MVP 為內存模擬）。
-   **`SyncService`:** 雙向同步的協調者，管理本地更改隊列，與雲端同步數據。
-   **`AnalyticsService`:** 數據分析服務，收集數據並計算 KPI。
-   **`EvolutionEngine`:** 進化引擎的核心邏輯，分析數據生成洞見，處理反饋，管理天賦。
-   **`FileService`:** 文件系統交互服務（MVP 為 WebContainer `fs` 模擬）。
-   **`RepositoryService`:** 代碼倉庫交互服務（MVP 為 Git 模擬）。
-   **`CalendarService`:** 日曆事件管理服務。
-   **`TemplateService`:** 模板管理服務。

## 5. 數據模型 (Data Model)

主要數據模型對應聖典的各個支柱，並通過 Supabase 進行持久化。關鍵表包括：

-   `users` (auth.users): Supabase 內建用戶表。
-   `profiles`: 擴展用戶信息，如 `rune_capacity`。
-   `knowledge_records`: 知識記錄 (Q&A, Journal Entries, Logs)。
-   `knowledge_collections`: 知識集合。
-   `knowledge_collection_records`: 知識集合與記錄的關聯表。
-   `knowledge_relations`: 知識記錄之間的關係。
-   `glossary`: 詞彙表條目。
-   `tasks`: 自動化任務。
-   `task_steps`: 任務步驟。
-   `agentic_flows`: 代理流程定義。
-   `agentic_flow_nodes`: 代理流程節點。
-   `agentic_flow_edges`: 代理流程邊。
-   `agentic_flow_executions`: 代理流程執行歷史。
-   `goals`: 用戶目標。
-   `key_results`: 關鍵結果。
-   `runes`: 符文定義和用戶配置。
-   `user_actions`: 用戶行為記錄。
-   `system_events`: 系統事件記錄（包括安全事件）。
-   `notifications`: 用戶通知。
-   `user_feedback`: 用戶對 AI 響應等的反饋。
-   `calendar_events`: 日曆事件。
-   `templates`: 用戶定義的模板。
-   `sensitive_data`: 加密存儲的敏感數據（如 API 密鑰）。

## 6. 關鍵流程 (Key Processes)

-   **用戶輸入處理:** Input Agent -> Decision Agent (意圖分析) -> Input Agent (行動分派) -> 目標代理 (執行)。
-   **任務執行:** Self-Navigation Engine 讀取任務步驟 -> 根據步驟類型調用相應代理/符文 -> 更新任務/步驟狀態。
-   **符文執行:** Rune Engrafting Agent 接收執行請求 -> 查找符文實例 -> 調用符文方法。
-   **數據同步:** Sync Service 管理本地隊列 -> 推送更改到 Supabase -> 通過 Realtime 接收遠程更改 -> 服務模塊應用更改。
-   **進化循環:** Evolution Engine 定期或事件觸發 -> Analytics Service 收集數據 -> Wisdom Secret Art 分析數據/生成洞見 -> Evolution Engine 存儲洞見/發布事件。
-   **權能鍛造:** Evolution Engine 識別模式/洞見 -> Authority Forging Engine 生成權能定義 -> Script Sandbox 執行腳本。

## 7. 安全考慮 (Security Considerations)

-   **RLS:** 嚴格的 Supabase RLS 策略確保數據隔離。
-   **安全存儲:** 敏感數據加密存儲，僅在需要時解密。
-   **API Proxy:** 統一管理外部 API 訪問，處理認證和限流。
-   **腳本沙箱:** 隔離執行用戶腳本，防止惡意代碼。
-   **審計與監控:** 記錄關鍵事件，監控異常行為。
-   **最小權限:** 各模塊和符文僅擁有執行其功能所需的最小權限。

## 8. 開發與部署 (Development & Deployment)

-   **開發環境:** WebContainer (StackBlitz) 或本地 Node.js 環境。
-   **數據庫遷移:** 使用 Supabase CLI 管理數據庫 schema 遷移。
-   **Edge Functions:** 使用 Supabase Edge Functions 處理後端邏輯和觸發器。
-   **CI/CD:** 使用 GitHub Actions 自動化測試和部署到 Supabase。

---

**這份規格書是 Jun.AI.Key 系統的藍圖。它將隨著項目的推進和功能的擴展而持續更新和完善。**
```